let meals = []
let currentId = 1

export class InMemoryNutritionDAO {
  async addMeal(meal) {
    const newMeal = {
      id: currentId++,
      userId: meal.userId || meal.user_id || null,
      name: meal.name || meal.description || 'meal',
      calories: meal.calories || null,
      created_at: meal.created_at || new Date().toISOString(),
    }
    meals.push(newMeal)
    return newMeal
  }

  async getMeals(userId) {
    if (!userId) return meals.slice().reverse()
    return meals.filter((m) => String(m.userId) === String(userId)).slice().reverse()
  }
  clear() {
    meals = []
    currentId = 1
  }
}

export default new InMemoryNutritionDAO()
