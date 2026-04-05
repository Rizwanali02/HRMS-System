import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { parse, isValid, startOfDay, isWeekend, isBefore, isAfter, addDays } from 'date-fns';

const VALID_LEAVE_TYPES = ['casual', 'sick', 'paid'];

const parseDate = (dateStr, fieldName) => {
  const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
  if (!isValid(parsed)) {
    throw new ApiError(400, `Invalid ${fieldName} format. Expected DD/MM/YYYY (e.g. 10/04/2026)`);
  }
  return startOfDay(parsed);
};

const countWorkingDays = (start, end) => {
  let count = 0;
  let current = start;
  while (!isAfter(current, end)) {
    if (!isWeekend(current)) count++;
    current = addDays(current, 1);
  }
  return count;
};

export const applyLeave = asyncHandler(async (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    throw new ApiError(400, 'leaveType, startDate, endDate and reason are all required');
  }

  const normalizedType = leaveType.trim().toLowerCase();
  if (!VALID_LEAVE_TYPES.includes(normalizedType)) {
    throw new ApiError(400, `leaveType must be one of: ${VALID_LEAVE_TYPES.join(', ')}`);
  }

  const start = parseDate(startDate, 'startDate');
  const end = parseDate(endDate, 'endDate');
  const today = startOfDay(new Date());

  if (isBefore(start, today)) {
    throw new ApiError(400, 'Start date cannot be in the past');
  }

  if (isBefore(end, start)) {
    throw new ApiError(400, 'End date cannot be before start date');
  }

  if (isWeekend(start)) {
    throw new ApiError(400, 'Leave cannot start on a weekend');
  }

  if (isWeekend(end)) {
    throw new ApiError(400, 'Leave cannot end on a weekend');
  }

  const totalDays = countWorkingDays(start, end);

  if (totalDays === 0) {
    throw new ApiError(400, 'Selected date range has no working days');
  }

  const user = await User.findById(req.user._id).select('leaveBalance');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }


  const overlapping = await Leave.findOne({
    userId: req.user._id,
    status: { $ne: 'rejected' },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } },
    ]
  });

  if (overlapping) {
    throw new ApiError(409, 'You already have a leave application overlapping these dates');
  }

  const leave = await Leave.create({
    userId: req.user._id,
    leaveType: normalizedType,
    startDate: start,
    endDate: end,
    totalDays,
    reason: reason.trim(),
    status: 'pending',
  });

  return res
    .status(201)
    .json(new ApiResponse(201, leave, `Leave applied successfully for ${totalDays} working day(s)`));
});

export const getMyLeaves = asyncHandler(async (req, res, next) => {
  const leaves = await Leave.find({ userId: req.user._id }).sort('-createdAt');

  res.status(200).json(
    new ApiResponse(200, { count: leaves.length, leaves }, "Leaves fetched successfully")
  );
});

export const editLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'User not authorized to update this leave');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Cannot edit processed leave');
  }

  const { leaveType, startDate, endDate, reason } = req.body;

  let start = leave.startDate;
  let end = leave.endDate;
  let totalDays = leave.totalDays;
  if (startDate || endDate) {
    const sDate = startDate || leave.startDate;
    const eDate = endDate || leave.endDate;

    start = typeof sDate === 'string' ? parseDate(sDate, 'startDate') : sDate;
    end = typeof eDate === 'string' ? parseDate(eDate, 'endDate') : eDate;

    if (isBefore(end, start)) {
      throw new ApiError(400, 'End date cannot be before start date');
    }

    totalDays = countWorkingDays(start, end);
    if (totalDays === 0) {
      throw new ApiError(400, 'Selected date range has no working days');
    }
  }

  leave = await Leave.findByIdAndUpdate(req.params.id, {
    leaveType: leaveType || leave.leaveType,
    startDate: start,
    endDate: end,
    reason: reason || leave.reason,
    totalDays
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json(
    new ApiResponse(200, leave, "Leave updated successfully")
  );
});

export const cancelLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'User not authorized to delete this leave');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Cannot cancel processed leave');
  }

  await leave.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, "Leave cancelled successfully")
  );
});
