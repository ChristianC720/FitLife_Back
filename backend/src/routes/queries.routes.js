import express from 'express'
import { QueryBus } from '../cqrs/index.js'

const router = express.Router()

router.get('/dashboard', async (req, res, next) => {
  try {
    const { userId } = req.query || {}
    const query = { type: 'GetDashboard', payload: { userId } }
    const result = await QueryBus.execute(query)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default router
