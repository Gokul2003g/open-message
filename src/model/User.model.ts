import mongoose from "mongoose";

export interface Message extends mongoose.Document {
  content: string;
  createdAt: Date;
}

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Message[];
}

const MessageSchema: mongoose.Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const UserSchema: mongoose.Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
});
