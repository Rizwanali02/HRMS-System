import express from 'express';
import { getUsers, getSystemAttendance, getSystemLeaves, approveLeave, rejectLeave } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/attendance', getSystemAttendance);
router.get('/leaves', getSystemLeaves);
router.put('/leave/:id/approve', approveLeave);
router.put('/leave/:id/reject', rejectLeave);

export default router;
