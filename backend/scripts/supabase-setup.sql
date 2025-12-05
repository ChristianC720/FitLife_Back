-- ============================================
-- Script de configuración de base de datos
-- Microservicio de Ejercicios - FitLife
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: exercise_plans
CREATE TABLE IF NOT EXISTS exercise_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  frequency TEXT,
  level TEXT NOT NULL,
  status TEXT DEFAULT 'Programado',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exercise_plans_category ON exercise_plans(category);
CREATE INDEX idx_exercise_plans_level ON exercise_plans(level);
CREATE INDEX idx_exercise_plans_status ON exercise_plans(status);
CREATE INDEX idx_exercise_plans_created_at ON exercise_plans(created_at DESC);

-- Tabla: plan_exercises
CREATE TABLE IF NOT EXISTS plan_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES exercise_plans(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  weight TEXT,
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  "order" INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_plan_exercises_plan_id ON plan_exercises(plan_id);
CREATE INDEX idx_plan_exercises_order ON plan_exercises(plan_id, "order");

-- Tabla: workout_history
CREATE TABLE IF NOT EXISTS workout_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES exercise_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  duration_minutes INTEGER,
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workout_history_date ON workout_history(date DESC);
CREATE INDEX idx_workout_history_plan_id ON workout_history(plan_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exercise_plans_updated_at
BEFORE UPDATE ON exercise_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo
INSERT INTO exercise_plans (name, category, description, duration, frequency, level, status, progress, schedule)
VALUES 
  ('Fuerza Total', 'Fuerza', 'Entrenamiento completo de fuerza para todo el cuerpo', '45 min', '3x semana', 'Intermedio', 'En progreso', 68, 'Hoy'),
  ('Cardio HIIT', 'Cardio', 'Entrenamiento de alta intensidad para quemar grasa', '30 min', '4x semana', 'Avanzado', 'Completado', 100, 'Ayer'),
  ('Yoga Matutino', 'Flexibilidad', 'Rutina suave para comenzar el día con energía', '25 min', 'Diario', 'Principiante', 'Programado', 32, 'Mañana');

INSERT INTO workout_history (name, date, duration_minutes, calories)
VALUES 
  ('Fuerza Total', NOW() - INTERVAL '1 day', 42, 380),
  ('Cardio HIIT', NOW() - INTERVAL '2 days', 28, 420),
  ('Yoga Matutino', NOW() - INTERVAL '3 days', 20, 150);

-- Tabla: meals (para la funcionalidad de nutrición)
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  name TEXT NOT NULL,
  calories INTEGER,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_created_at ON meals(created_at DESC);