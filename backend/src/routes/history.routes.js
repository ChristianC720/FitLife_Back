import express from 'express';
import {
  getWorkoutHistory,
  createWorkoutEntry,
  deleteWorkoutEntry // ⬅️ AGREGAR
} from '../controllers/history.controller.js';

const router = express.Router();

router.get('/', getWorkoutHistory);
router.post('/', createWorkoutEntry);
router.delete('/:id', deleteWorkoutEntry); // ⬅️ AGREGAR

export default router;