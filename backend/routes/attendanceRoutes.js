import express from 'express';
import { markAttendance, getMyAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/mark', markAttendance);
router.get('/my-attendance', getMyAttendance);

export default router;
