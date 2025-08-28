import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { createToken } from "../utils/createToken";
import { User } from "../models/User";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be less than 30 characters")
    .trim(),

  email: z.email("Please provide a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be less than 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  role: z.enum(["user", "admin"]).default("user"),

  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Please provide a valid phone number")
    .optional(),

  address: z.object({
    street: z
      .string()
      .min(1, "Street is required")
      .max(50, "Street must be less than 50 characters")
      .trim(),
    houseNumber: z.number("House number must be a number"),
    floorNumber: z.number("Floor number must be a number").optional(),
    apartmentNumber: z.number("Apartment number must be a number").optional(),
  }),
});

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password, role, phone, address } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password using your utility function
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });

    // Generate JWT token using your utility function (passing email)
    const token = createToken(email);

    // Send response (password is excluded due to toJSON transform in model)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Handle other errors
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(
      password,
      user.password as string
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = createToken(email);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // User is available from the authenticate middleware
    // req.user is set by the authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};
