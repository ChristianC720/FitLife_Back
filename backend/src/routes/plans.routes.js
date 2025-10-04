import express from 'express';
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  addExerciseToPlan,
  updateExercise,
  deleteExercise
} from '../controllers/plans.controller.js';

const router = express.Router();

// Rutas de planes
router.get('/', getAllPlans);
router.get('/:id', getPlanById);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

// Rutas de ejercicios dentro de un plan
router.post('/:planId/exercises', addExerciseToPlan);
router.put('/:planId/exercises/:exerciseId', updateExercise);
router.delete('/:planId/exercises/:exerciseId', deleteExercise);

export default router;