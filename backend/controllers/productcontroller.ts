import { Request, Response } from "express";
import { Product } from "../models/Product";

export const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can add products",
      });
    }

    const { title, price, image, description } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, price and description are required",
      });
    }

    const product = new Product({
      title,
      price,
      image,
      description,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
