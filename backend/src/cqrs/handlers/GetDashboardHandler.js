import * as nutritionService from '../../services/nutrition.service.js'

export async function handleGetDashboard(query) {
  const { userId } = query.payload || {}
  if (!userId) {
    const err = new Error('userId is required')
    err.status = 400
    throw err
  }

  const meals = await nutritionService.getMeals(userId)
  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0)

  const viewModel = {
    totalCaloriesToday: totalCalories,
    mealsCount: meals.length,
    recentMeals: meals.slice(0, 5),
  }

  return { success: true, data: viewModel }
}

export default handleGetDashboard
