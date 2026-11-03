import mongoose from 'mongoose';

const connectDB = async () => {
  const dbUri = process.env.MONGO_DB_URI || process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!dbUri) {
    console.error('Fatal: MongoDB connection URI is missing! Set MONGO_DB_URI or MONGO_URI in environment.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Mongo DB connected Successfully');
    console.log('DB Host :', conn.connection.host);
    console.log('DB Name :', conn.connection.name);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
