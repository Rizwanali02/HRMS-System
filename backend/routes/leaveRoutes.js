import express from 'express';
import { applyLeave, getMyLeaves, editLeave, cancelLeave } from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.route('/:id').put(editLeave).delete(cancelLeave);

export default router;
