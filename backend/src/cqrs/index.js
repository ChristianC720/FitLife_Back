import { registerCommandHandler, executeCommand } from './CommandBus.js'
import { registerQueryHandler, executeQuery } from './QueryBus.js'
import { handleRegisterFood } from './handlers/RegisterFoodHandler.js'
import { handleGetDashboard } from './handlers/GetDashboardHandler.js'

registerCommandHandler('RegisterFood', handleRegisterFood)
registerQueryHandler('GetDashboard', handleGetDashboard)

export const CommandBus = { execute: executeCommand }
export const QueryBus = { execute: executeQuery }

export default { CommandBus, QueryBus }
