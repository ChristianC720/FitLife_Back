const handlers = new Map()

export function registerQueryHandler(type, handler) {
  handlers.set(type, handler)
}

export async function executeQuery(query) {
  if (!query || !query.type) throw new Error('Query must have a type')
  const handler = handlers.get(query.type)
  if (!handler) throw new Error(`No handler registered for query type ${query.type}`)
  return handler(query)
}

export default { registerQueryHandler, executeQuery }
