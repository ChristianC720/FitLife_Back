import { supabase } from '../config/supabase.js'

const TABLE = 'meals'

export class SupabaseNutritionDAO {
  async addMeal(meal) {
    const payload = {
      user_id: meal.userId || meal.user_id || null,
      name: meal.name || meal.description || null,
      calories: meal.calories || null,
      protein: meal.protein || null,
      carbs: meal.carbs || null,
      fats: meal.fats || null,
      created_at: meal.created_at || new Date().toISOString(),
    }

    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single()
    if (error) {
      error.message = `SupabaseNutritionDAO.addMeal error: ${error.message}`
      throw error
    }
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats,
      created_at: data.created_at,
    }
  }

  async getMeals(userId) {
    let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false })
    if (userId) {
      query = query.eq('user_id', userId)
    }
    const { data, error } = await query
    if (error) {
      error.message = `SupabaseNutritionDAO.getMeals error: ${error.message}`
      throw error
    }
    return (data || []).map((d) => ({
      id: d.id,
      userId: d.user_id,
      name: d.name,
      calories: d.calories,
      protein: d.protein,
      carbs: d.carbs,
      fats: d.fats,
      created_at: d.created_at,
    }))
  }
}

export default new SupabaseNutritionDAO()
