import { supabase } from '../config/supabase.js';

export const getDailyMetrics = async (userId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
};


export const getProgressSummary = async (userId, days = 7) => {
  const metrics = await getDailyMetrics(userId, days);

  if (!metrics || metrics.length === 0) {
    return {
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      totalDuration: 0,
      avgWeight: 0,
      weightChange: 0,
      avgCaloriesConsumed: 0,
    };
  }

  const totalWorkouts = metrics.reduce((sum, m) => sum + (m.workout_count || 0), 0);
  const totalCaloriesBurned = metrics.reduce((sum, m) => sum + (m.calories_burned || 0), 0);
  const totalDuration = metrics.reduce((sum, m) => sum + (m.workout_duration_minutes || 0), 0);
  const avgWeight = metrics.reduce((sum, m) => sum + (parseFloat(m.weight) || 0), 0) / metrics.length;
  const avgCaloriesConsumed = metrics.reduce((sum, m) => sum + (m.calories_consumed || 0), 0) / metrics.length;

  const firstWeight = parseFloat(metrics[0]?.weight || 0);
  const lastWeight = parseFloat(metrics[metrics.length - 1]?.weight || 0);
  const weightChange = lastWeight - firstWeight;

  return {
    totalWorkouts,
    totalCaloriesBurned,
    totalDuration,
    avgWeight: Math.round(avgWeight * 10) / 10,
    weightChange: Math.round(weightChange * 10) / 10,
    avgCaloriesConsumed: Math.round(avgCaloriesConsumed),
  };
};


export const getExerciseDistribution = async (userId) => {
 
  const { data: history, error } = await supabase
    .from('workout_history')
    .select(`
      *,
      exercise_plans!inner(category)
    `)
    .eq('user_id', userId)
    .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error('Error obteniendo distribución:', error);
    return [];
  }

  if (!history || history.length === 0) {
    return [];
  }


  const categoryCounts = {};
  history.forEach(item => {
    const category = item.exercise_plans?.category || 'otros';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return [];

 
  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / total) * 100),
  }));
};


export const getCalorieBalance = async (userId, days = 7) => {
  const metrics = await getDailyMetrics(userId, days);
  
  return metrics.map(m => ({
    date: m.date,
    consumed: m.calories_consumed || 0,
    burned: m.calories_burned || 0,
    balance: (m.calories_consumed || 0) - (m.calories_burned || 0),
  }));
};


export const getWeightTrend = async (userId, days = 30) => {
  const { data, error } = await supabase
    .from('user_daily_metrics')
    .select('date, weight')
    .eq('user_id', userId)
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: true });

  if (error) throw error;

  return data.map(m => ({
    date: m.date,
    weight: parseFloat(m.weight),
  }));
};


export const getUserGoals = async (userId) => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};


export const getGoalsProgress = async (userId) => {
  const goals = await getUserGoals(userId);
  
  return goals.map(goal => ({
    id: goal.id,
    type: goal.goal_type,
    target: parseFloat(goal.target_value),
    current: parseFloat(goal.current_value),
    percentage: Math.round((parseFloat(goal.current_value) / parseFloat(goal.target_value)) * 100),
    status: goal.status,
  }));
};


export const upsertDailyMetric = async (userId, metricData) => {
  const { data, error } = await supabase
    .from('user_daily_metrics')
    .upsert([{
      user_id: userId,
      date: metricData.date || new Date().toISOString().split('T')[0],
      weight: metricData.weight,
      calories_consumed: metricData.calories_consumed,
      calories_burned: metricData.calories_burned,
      workout_duration_minutes: metricData.workout_duration_minutes,
      workout_count: metricData.workout_count,
      updated_at: new Date().toISOString(),
    }], {
      onConflict: 'user_id,date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const createGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert([{
      user_id: userId,
      goal_type: goalData.goal_type,
      target_value: goalData.target_value,
      current_value: goalData.current_value || 0,
      start_date: goalData.start_date || new Date().toISOString().split('T')[0],
      target_date: goalData.target_date,
      status: 'active',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const updateGoal = async (goalId, goalData) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({
      ...goalData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
};