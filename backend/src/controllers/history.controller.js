import * as historyService from '../services/history.service.js';

export const getWorkoutHistory = async (req, res, next) => {
  try {
    const history = await historyService.getWorkoutHistory();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkoutEntry = async (req, res, next) => {
  try {
    const workoutData = req.body;
    
    if (!workoutData.name) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del entrenamiento es requerido'
      });
    }
    
    const newEntry = await historyService.createWorkoutEntry(workoutData);
    
    res.status(201).json({
      success: true,
      data: newEntry,
      message: 'Entrenamiento registrado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};