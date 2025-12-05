import InMemoryNutritionDAO from '../dao/InMemoryNutritionDAO.js'
import SupabaseNutritionDAO from '../dao/SupabaseNutritionDAO.js'

const daoSelector = () => {
  const mode = (process.env.NUTRITION_DAO || '').toLowerCase()
  if (mode === 'supabase') return SupabaseNutritionDAO
  return InMemoryNutritionDAO
}

const DAO = daoSelector()

export const addMeal = async (meal) => {
  return DAO.addMeal(meal)
}

export const getMeals = async (userId) => {
  return DAO.getMeals(userId)
}

export const clearMeals = () => {
  if (typeof DAO.clear === 'function') DAO.clear()
}

export default { addMeal, getMeals, clearMeals }
