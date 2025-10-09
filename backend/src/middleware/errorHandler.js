export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Error en la operación con la base de datos',
      code: err.code
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
};