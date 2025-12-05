export function createGetDashboardQuery({ userId }) {
  return {
    type: 'GetDashboard',
    payload: { userId },
  }
}

export default createGetDashboardQuery
