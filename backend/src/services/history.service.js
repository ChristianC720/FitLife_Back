import { supabase } from '../config/supabase.js';

export const getWorkoutHistory = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .gte('date', thirtyDaysAgo.toISOString())
    .order('date', { ascending: false });

  if (error) throw error;

  return data.map(entry => ({
    id: entry.id,
    name: entry.name,
    date: new Date(entry.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    duration: entry.duration_minutes ? `${entry.duration_minutes} min` : 'N/A',
    calories: entry.calories ? `${entry.calories} cal` : 'N/A',
    accent: getAccentColor(entry.name)
  }));
};

export const createWorkoutEntry = async (workoutData) => {
  const { data, error } = await supabase
    .from('workout_history')
    .insert([{
      plan_id: workoutData.plan_id || null,
      name: workoutData.name,
      date: workoutData.date || new Date().toISOString(),
      duration_minutes: workoutData.duration_minutes || null,
      calories: workoutData.calories || null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

function getAccentColor(name) {
  const colors = ['primary', 'success', 'warning'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export const deleteWorkoutEntry = async (id) => {
  const { error } = await supabase
    .from('workout_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar entrada del historial:', error);
    throw error;
  }

  console.log('Entrada eliminada del historial:', id);
  return true;
};