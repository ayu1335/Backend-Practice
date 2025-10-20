// model/db.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const User = new Schema({
  username: String,
  password: String
});

export const UserModel = mongoose.model('User', User);
