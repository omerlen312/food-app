import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Will store user info after authentication
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Step 2: Check if token exists and has proper format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided or invalid format",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7); // Remove "Bearer "

    // Step 3: Verify the token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secretKey) as { email: string };

    // Step 4: Find user from token
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found",
      });
    }

    // Step 5: Add user to request object
    req.user = user;

    // Step 6: Call next() to continue to the protected route
    next();
  } catch (error: any) {
    // Handle different types of JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated (should be called after authenticate)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate first",
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
    }

    next();
  };
};
