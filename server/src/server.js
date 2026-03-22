require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');

const PORT = process.env.PORT || 5000;
let memoryMongo;

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to configured MongoDB instance');
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    console.warn('Configured MongoDB unavailable, starting in-memory MongoDB for local development');
    memoryMongo = await MongoMemoryServer.create();
    await mongoose.connect(memoryMongo.getUri());
    console.log('Connected to in-memory MongoDB');
  }
}

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  if (memoryMongo) {
    await memoryMongo.stop();
  }
  process.exit(0);
});
