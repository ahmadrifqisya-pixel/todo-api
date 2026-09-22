const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

function generateToken(user) {
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET || 'fallback_secret_test',
  );
}

async function register({ name, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user, token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return { user, token };
}

module.exports = { register, login };