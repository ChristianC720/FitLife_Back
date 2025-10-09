import * as plansService from '../services/plans.service.js';

export const getAllPlans = async (req, res, next) => {
  try {
    const { type, category, level, search } = req.query;
    
    const filters = {
      type: category || type,
      level,
      search
    };
    
    const plans = await plansService.getAllPlans(filters);
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await plansService.getPlanById(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const planData = req.body;
    
    if (!planData.name || !planData.category || !planData.level) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, categoría y nivel son campos requeridos'
      });
    }
    
    const newPlan = await plansService.createPlan(planData);
    
    res.status(201).json({
      success: true,
      data: newPlan,
      message: 'Plan creado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    
    const updatedPlan = await plansService.updatePlan(id, planData);
    
    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        error: 'Plan no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: updatedPlan,
      message: 'Plan actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await plansService.deletePlan(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Plan no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Plan eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const addExerciseToPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const exerciseData = req.body;
    
    if (!exerciseData.exercise_name || !exerciseData.sets || !exerciseData.reps) {
      return res.status(400).json({
        success: false,
        error: 'Nombre del ejercicio, series y repeticiones son campos requeridos'
      });
    }
    
    const newExercise = await plansService.addExerciseToPlan(planId, exerciseData);
    
    res.status(201).json({
      success: true,
      data: newExercise,
      message: 'Ejercicio agregado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const updateExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const exerciseData = req.body;
    
    const updatedExercise = await plansService.updateExercise(exerciseId, exerciseData);
    
    if (!updatedExercise) {
      return res.status(404).json({
        success: false,
        error: 'Ejercicio no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: updatedExercise,
      message: 'Ejercicio actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    
    const deleted = await plansService.deleteExercise(exerciseId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Ejercicio no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Ejercicio eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
export const completePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await plansService.completePlan(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Plan no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Plan completado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};