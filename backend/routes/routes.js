import express from 'express';
import authRoutes from './authRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leave', leaveRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/admin', adminRoutes);

export default router;
