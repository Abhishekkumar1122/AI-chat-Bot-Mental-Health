const mongoose = require('mongoose');
const app = require('../src/app');

let cachedConnection = null;
let connectingPromise = null;

async function ensureDatabaseConnection() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  connectingPromise = mongoose
    .connect(process.env.MONGODB_URI)
    .then((connection) => {
      cachedConnection = connection;
      return cachedConnection;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error('Vercel function startup error:', error.message);
    return res.status(500).json({
      message: 'Backend startup failed',
      error: error.message,
    });
  }
};
