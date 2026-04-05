import Attendance from '../models/Attendance.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { startOfDay, isWeekend, isToday } from 'date-fns';

export const markAttendance = asyncHandler(async (req, res, next) => {
  const { date, status } = req.body;

  if (!date || !status) {
    throw new ApiError(400, 'Date and status are required');
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, 'Invalid date format');
  }

  const attendanceDate = startOfDay(parsedDate);
  const today = startOfDay(new Date());

  
  
  
  
  
  
  
  
  
  

  
  
  

  try {
    const attendance = await Attendance.create({
      userId: req.user._id,
      date: attendanceDate,
      status: status.trim().toLowerCase()
    });

    return res
      .status(201)
      .json(new ApiResponse(201, attendance, 'Attendance marked successfully'));

  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, 'Attendance for today is already marked');
    }
    throw err;
  }
});

export const getMyAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({ userId: req.user._id }).sort('-date');

  res.status(200).json(
    new ApiResponse(200, { count: attendance.length, attendance }, "Attendance fetched successfully")
  );
});
