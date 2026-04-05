import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (!user) {
    throw new ApiError(400, 'Invalid user data');
  }

  const createdUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    leaveBalance: user.leaveBalance
  };

  const token = generateToken(user._id);

  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
  };

  res.status(201)
  .cookie("token", token, options)
  .json(
    new ApiResponse(201, { user: createdUser, token }, "User registered successfully")
  );
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required")
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const loggedInUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    leaveBalance: user.leaveBalance
  };

  const token = generateToken(user._id);

  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
  };

  res.status(200)
  .cookie("token", token, options)
  .json(
    new ApiResponse(200, { user: loggedInUser, token }, "Logged in successfully")
  );
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    leaveBalance: user.leaveBalance
  };

  res.status(200).json(
    new ApiResponse(200, userData, "Profile fetched successfully")
  );
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
  };

  res.status(200)
  .clearCookie("token", options)
  .json(
    new ApiResponse(200, {}, "Logged out successfully")
  );
});
