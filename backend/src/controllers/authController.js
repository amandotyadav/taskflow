import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    req.user.name = name.trim();
    await req.user.save();

    return res.status(200).json({ user: sanitizeUser(req.user) });
  } catch (error) {
    return next(error);
  }
};
