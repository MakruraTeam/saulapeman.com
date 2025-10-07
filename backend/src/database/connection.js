import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const user = encodeURIComponent(process.env.DB_USER || '');
const password = encodeURIComponent(process.env.DB_PASS || '');
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const uri = `mongodb://${user}:${password}@${host}/${dbName}`;

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}
