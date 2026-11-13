import mongoose from 'mongoose';

let isConnecting = false;

const setupConnectionListeners = () => {
  if (mongoose.connection._hasSetupListeners) return;
  mongoose.connection._hasSetupListeners = true;

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting reconnection...');
    setTimeout(connectDB, 5000);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
  });
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;

  const dbUri =
    process.env.MONGO_DB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb+srv://Anshugupta:Anshugupta15029@mydatabase.eis38hf.mongodb.net/Cravings_DB?retryWrites=true&w=majority';
  if (!dbUri) {
    console.error('MongoDB URI missing in environment variables');
    return;
  }

  setupConnectionListeners();
  isConnecting = true;

  try {
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error('Database connection attempt failed:', error.message);
    if (!process.env.VERCEL) {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    }
  }
};

export default connectDB;
