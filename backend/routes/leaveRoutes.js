import express from 'express';
import { applyLeave, getMyLeaves, editLeave, cancelLeave } from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);

router.put('/:id', editLeave);
router.delete('/:id', cancelLeave);

export default router;
