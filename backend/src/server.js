import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plansRoutes from './routes/plans.routes.js';
import historyRoutes from './routes/history.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Logging middleware simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏋️ Microservicio de ejercicios FitLife funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
app.use('/api/plans', plansRoutes);
app.use('/api/history', historyRoutes);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🏋️  Microservicio de Ejercicios - FitLife`);
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 CORS habilitado para: ${FRONTEND_URL}`);
  console.log('🚀 ========================================');
});

export default app;