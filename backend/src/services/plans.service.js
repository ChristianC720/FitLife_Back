import { supabase } from '../config/supabase.js';

export const getAllPlans = async (filters = {}) => {
  let query = supabase
    .from('exercise_plans')
    .select('*, plan_exercises(count)')
    .order('created_at', { ascending: false });

  if (filters.type && filters.type !== 'all') {
    query = query.eq('category', filters.type);
  }

  if (filters.level && filters.level !== 'all') {
    query = query.eq('level', filters.level);
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map(plan => ({
    ...plan,
    exercises: plan.plan_exercises?.[0]?.count || 0
  }));
};

export const getPlanById = async (id) => {
  const { data: plan, error: planError } = await supabase
    .from('exercise_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (planError) throw planError;
  if (!plan) return null;

  const { data: exercises, error: exercisesError } = await supabase
    .from('plan_exercises')
    .select('*')
    .eq('plan_id', id)
    .order('order', { ascending: true });

  if (exercisesError) throw exercisesError;

  return {
    ...plan,
    exercises: exercises || []
  };
};

export const createPlan = async (planData) => {
  const { data, error } = await supabase
    .from('exercise_plans')
    .insert([{
      name: planData.name,
      category: planData.category,
      description: planData.description || null,
      duration: planData.duration || null,
      frequency: planData.frequency || null,
      level: planData.level,
      status: planData.status || 'Programado',
      progress: planData.progress || 0,
      schedule: planData.schedule || null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePlan = async (id, planData) => {
  const { data, error } = await supabase
    .from('exercise_plans')
    .update({
      ...planData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePlan = async (id) => {
  const { error } = await supabase
    .from('exercise_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const addExerciseToPlan = async (planId, exerciseData) => {
  const { data: existingExercises } = await supabase
    .from('plan_exercises')
    .select('order')
    .eq('plan_id', planId)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = existingExercises && existingExercises.length > 0
    ? existingExercises[0].order + 1
    : 1;

  const { data, error } = await supabase
    .from('plan_exercises')
    .insert([{
      plan_id: planId,
      exercise_name: exerciseData.exercise_name,
      sets: exerciseData.sets,
      reps: exerciseData.reps,
      weight: exerciseData.weight || null,
      rest_seconds: exerciseData.rest_seconds || 60,
      notes: exerciseData.notes || null,
      order: exerciseData.order || nextOrder
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExercise = async (exerciseId, exerciseData) => {
  const { data, error } = await supabase
    .from('plan_exercises')
    .update(exerciseData)
    .eq('id', exerciseId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExercise = async (exerciseId) => {
  const { error } = await supabase
    .from('plan_exercises')
    .delete()
    .eq('id', exerciseId);

  if (error) throw error;
  return true;
};