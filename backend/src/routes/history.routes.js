import express from 'express';
import {
  getWorkoutHistory,
  createWorkoutEntry
} from '../controllers/history.controller.js';

const router = express.Router();

router.get('/', getWorkoutHistory);
router.post('/', createWorkoutEntry);

export default router;