import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    tokenVersion: { type: Number, default: 0 },
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
export const File = mongoose.model("File", fileSchema);


