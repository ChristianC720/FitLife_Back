import express from 'express';
import { getMeals, addMeal } from '../controllers/nutrition.controller.js';

const router = express.Router();

router.get('/meals', getMeals);
router.post('/meals', addMeal);

export default router;
