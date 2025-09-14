import multer from "multer";
import jwt from "jsonwebtoken";
import { User } from "../model/model.js";
import fs from "fs";
import bcrypt from "bcryptjs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const uploadMiddleware = multer({ storage });

export const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = async (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return null;
    if (user.tokenVersion !== decoded.tokenVersion) return null;
    return user.id;
  } catch {
    return null;
  }
};

// ------------------- REST Auth Middleware -------------------
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const userId = await verifyToken(token);
  if (!userId) return res.status(401).json({ error: "Unauthorized or invalid token" });
  req.userId = userId;
  next();
};


export const encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
}