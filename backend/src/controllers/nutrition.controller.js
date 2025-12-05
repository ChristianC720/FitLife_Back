import * as nutritionService from '../services/nutrition.service.js';

export const getMeals = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const meals = await nutritionService.getMeals(userId);
    res.json({ success: true, data: meals });
  } catch (error) {
    next(error);
  }
};

export const addMeal = async (req, res, next) => {
  try {
    const meal = req.body;
    if (!meal) {
      return res.status(400).json({ success: false, error: 'Meal body required' });
    }

    const created = await nutritionService.addMeal(meal);
    res.status(201).json({ success: true, data: created, message: 'Meal added' });
  } catch (error) {
    next(error);
  }
};

export default { getMeals, addMeal };
