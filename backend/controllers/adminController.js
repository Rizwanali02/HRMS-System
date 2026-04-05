import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments({});
  const users = await User.find({}).skip(skip).limit(limit);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    }, "Users fetched successfully")
  );
});

export const getSystemAttendance = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalAttendance = await Attendance.countDocuments({});
  const attendance = await Attendance.find({})
    .populate('userId', 'name email')
    .sort('-date')
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(200, {
      attendance,
      pagination: {
        totalItems: totalAttendance,
        totalPages: Math.ceil(totalAttendance / limit),
        currentPage: page,
        limit
      }
    }, "System attendance fetched successfully")
  );
});

export const getSystemLeaves = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalLeaves = await Leave.countDocuments({});
  const leaves = await Leave.find({})
    .populate('userId', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(200, {
      leaves,
      pagination: {
        totalItems: totalLeaves,
        totalPages: Math.ceil(totalLeaves / limit),
        currentPage: page,
        limit
      }
    }, "System leaves fetched successfully")
  );
});

export const approveLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, `Leave is already ${leave.status}`);
  }

  const user = await User.findById(leave.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.leaveBalance < leave.totalDays) {
    throw new ApiError(400, `Insufficient leave balance. User only has ${user.leaveBalance} days remaining, but requested ${leave.totalDays} days.`);
  }

  leave.status = 'approved';
  await leave.save();

  user.leaveBalance -= leave.totalDays;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, leave, "Leave approved successfully")
  );
});

export const rejectLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, `Leave is already ${leave.status}`);
  }

  leave.status = 'rejected';
  await leave.save();

  res.status(200).json(
    new ApiResponse(200, leave, "Leave rejected successfully")
  );
});
