import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
          success: err.success,
          message: err.message,
          errors: err.errors,
          data: err.data
      })
  }

  let error = { ...err };
  error.message = err.message;
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new Error(message);
    statusCode = 404;
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
