export function createRegisterFoodCommand({ userId, name, calories, timestamp }) {
  return {
    type: 'RegisterFood',
    payload: {
      userId,
      name,
      calories,
      timestamp,
    },
  }
}

export default createRegisterFoodCommand
