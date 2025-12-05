import express from 'express'
import { CommandBus } from '../cqrs/index.js'

const router = express.Router()

router.post('/register-food', async (req, res, next) => {
  try {
    const { userId, name, calories, timestamp } = req.body || {}
    const command = { type: 'RegisterFood', payload: { userId, name, calories, timestamp } }
    const result = await CommandBus.execute(command)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

export default router
