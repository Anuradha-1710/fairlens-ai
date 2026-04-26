exports.errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: messages[0] });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Generic error
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  });
};

module.exports = exports.errorHandler;
