/**
 * Middleware global para manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de Supabase
  if (err.code) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Error en la operación con la base de datos',
      code: err.code
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
};