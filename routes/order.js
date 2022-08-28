import express from "express";
import { OrderModel } from "../models/Order.js";
import { verifyBuyerToken, verifySellerToken } from "./verifyToken.js";

const router = express.Router();

// @desc: Create an order
// @route: POST localhost:5000/api/orders/buyer/create/{sellerId}
// @access: private
router.post("/buyer/create/:id", verifyBuyerToken, async (req, res) => {
  const newOrder = new OrderModel({
    buyer: req.user.id,
    seller: req.params.id,
    products: req.body.products,
  });

  try {
    const savedOrder = await newOrder.save();

    res.status(201).json({
      ...savedOrder._doc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: Fetch seller's orders
// @route: GET localhost:5000/api/orders/seller/{sellerId}
// @access: private
router.get("/seller/:id", verifySellerToken, async (req, res) => {
  try {
    const orders = await OrderModel.find({
      seller: req.params.id,
    });

    res.status(200).json({
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as orderRoute };
