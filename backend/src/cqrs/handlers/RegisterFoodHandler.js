import * as nutritionService from '../../services/nutrition.service.js'

export async function handleRegisterFood(command) {
  const { userId, name, calories, timestamp } = command.payload || {}
  if (!userId || !name) {
    const err = new Error('userId and name are required')
    err.status = 400
    throw err
  }

  const meal = {
    userId,
    name,
    calories: typeof calories === 'number' ? calories : null,
    created_at: timestamp || new Date().toISOString(),
  }

  const created = await nutritionService.addMeal(meal)

  return { success: true, data: created }
}

export default handleRegisterFood
