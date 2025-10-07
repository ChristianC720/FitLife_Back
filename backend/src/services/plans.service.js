import { supabase } from '../config/supabase.js';

export const getAllPlans = async (filters = {}) => {
  console.log('🔍 Filtros recibidos en service:', filters);
  
  let query = supabase
    .from('exercise_plans')
    .select('*, plan_exercises(count)')
    .order('created_at', { ascending: false });

  if (filters.type && filters.type !== 'all' && filters.type.trim() !== '') {
    console.log('✅ Aplicando filtro de tipo:', filters.type);
    query = query.eq('category', filters.type);
  }

  if (filters.level && filters.level !== 'all' && filters.level.trim() !== '') {
    console.log('✅ Aplicando filtro de nivel:', filters.level);
    query = query.eq('level', filters.level);
  }

  if (filters.search && filters.search.trim() !== '') {
    console.log('✅ Aplicando filtro de búsqueda:', filters.search);
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }

  console.log('📦 Planes encontrados:', data?.length);

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

export const completePlan = async (planId) => {
  // 1. Actualizar el plan a "Completado"
  const { data: plan, error: planError } = await supabase
    .from('exercise_plans')
    .update({
      status: 'Completado',
      progress: 100,
      updated_at: new Date().toISOString()
    })
    .eq('id', planId)
    .select()
    .single();

  if (planError) {
    console.error('❌ Error al completar plan:', planError);
    throw planError;
  }

  // 2. Crear entrada en el historial con fecha actual en formato ISO
  const now = new Date();
  
  const { data: historyEntry, error: historyError } = await supabase
    .from('workout_history')
    .insert([{
      name: plan.name,
      plan_id: planId,
      date: now.toISOString(), // Fecha en formato ISO completo
      duration_minutes: parseInt(plan.duration) || null,
      calories: null,
    }])
    .select()
    .single();

  if (historyError) {
    console.error('❌ Error al crear historial:', historyError);
    throw historyError;
  }

  console.log('✅ Plan completado y agregado al historial:', historyEntry);

  return {
    plan,
    historyEntry
  };
};