import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plansRoutes from './routes/plans.routes.js';
import historyRoutes from './routes/history.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import progressRoutes from './routes/progress.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: ' Microservicio de ejercicios FitLife funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
app.use('/api/plans', plansRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/progress', progressRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});


app.use(errorHandler);


app.listen(PORT, () => {
  console.log(' ========================================');
  console.log(`  Microservicio de Ejercicios - FitLife`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(` CORS habilitado para: ${FRONTEND_URL}`);
  console.log(' ========================================');
});

export default app;