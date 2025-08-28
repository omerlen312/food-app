import { Request, Response } from "express";
import { Order } from "../models/Order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { items, total } = req.body;

    if (!items || !total) {
      return res.status(400).json({
        success: false,
        message: "Items and total are required",
      });
    }

    const order = new Order({
      userid: req.user._id,
      items,
      total,
      createdAt: new Date(),
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await Order.find({ userid: req.user._id }).populate("items");
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
