import express from 'express';
import {
  getProgressSummary,
  getDailyMetrics,
  getExerciseDistribution,
  getCalorieBalance,
  getWeightTrend,
  getUserGoals,
  getGoalsProgress,
  upsertDailyMetric,
  createGoal,
  updateGoal,
} from '../controllers/progress.controller.js';

const router = express.Router();


router.get('/summary', getProgressSummary);
router.get('/metrics', getDailyMetrics);
router.get('/distribution', getExerciseDistribution);
router.get('/calories', getCalorieBalance);
router.get('/weight', getWeightTrend);
router.get('/goals', getUserGoals);
router.get('/goals/progress', getGoalsProgress);


router.post('/metrics', upsertDailyMetric);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);

export default router;