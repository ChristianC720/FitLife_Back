import * as progressService from '../services/progress.service.js';

/**
 * Obtener resumen de progreso
 */
export const getProgressSummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    // Por ahora usamos un userId fijo (después lo obtendremos de auth)
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const summary = await progressService.getProgressSummary(userId, parseInt(days));
    
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener métricas diarias
 */
export const getDailyMetrics = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const metrics = await progressService.getDailyMetrics(userId, parseInt(days));
    
    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener distribución de ejercicios
 */
export const getExerciseDistribution = async (req, res, next) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const distribution = await progressService.getExerciseDistribution(userId);
    
    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener balance calórico
 */
export const getCalorieBalance = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const balance = await progressService.getCalorieBalance(userId, parseInt(days));
    
    res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener tendencia de peso
 */
export const getWeightTrend = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const trend = await progressService.getWeightTrend(userId, parseInt(days));
    
    res.json({
      success: true,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener metas del usuario
 */
export const getUserGoals = async (req, res, next) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const goals = await progressService.getUserGoals(userId);
    
    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener progreso de metas
 */
export const getGoalsProgress = async (req, res, next) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    
    const progress = await progressService.getGoalsProgress(userId);
    
    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear o actualizar métrica diaria
 */
export const upsertDailyMetric = async (req, res, next) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const metricData = req.body;
    
    const metric = await progressService.upsertDailyMetric(userId, metricData);
    
    res.json({
      success: true,
      data: metric,
      message: 'Métrica actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva meta
 */
export const createGoal = async (req, res, next) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const goalData = req.body;
    
    const goal = await progressService.createGoal(userId, goalData);
    
    res.status(201).json({
      success: true,
      data: goal,
      message: 'Meta creada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar meta
 */
export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goalData = req.body;
    
    const goal = await progressService.updateGoal(id, goalData);
    
    res.json({
      success: true,
      data: goal,
      message: 'Meta actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};