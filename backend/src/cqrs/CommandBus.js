const handlers = new Map()

export function registerCommandHandler(type, handler) {
  handlers.set(type, handler)
}

export async function executeCommand(command) {
  if (!command || !command.type) throw new Error('Command must have a type')
  const handler = handlers.get(command.type)
  if (!handler) throw new Error(`No handler registered for command type ${command.type}`)
  return handler(command)
}

export default { registerCommandHandler, executeCommand }
