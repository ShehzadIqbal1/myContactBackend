import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// @desc    Login user
// @route   POST /api/users/login
// @access  public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid");
    }
  } catch (err) {
    console.log("Error in login user:", err);
    throw new Error("Login failed");
  }
});

// @desc    Register a user
// @route   POST /api/users/register
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (err) {
    console.log("Error in registering user:", err);
    throw new Error("Registration failed");
  }
});

// @desc    Current user info
// @route   POST /api/users/current
// @access  private
const currentUser = asyncHandler(async (req, res) => {
  try {
    res.json({ message: "Current user information" });
  } catch (err) {
    console.log("Error in fetching user:", err);
    throw new Error("Fetching current user failed");
  }
});

export { registerUser, loginUser, currentUser };
