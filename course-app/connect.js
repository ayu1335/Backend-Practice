// connect.js
import mongoose from 'mongoose';
export default async function connectDB(url) {
  return mongoose.connect(url);
}
