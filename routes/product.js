import { query, Router } from "express";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "./verifyToken.js";
import CryptoJS from "crypto-js";
import { ProductModel } from "../models/Product.js";
import mongoose from "mongoose";

const router = Router();

// @desc: Add products that are availabe for sellers
// @route: localhost:5000/api/proudcts/add
// @access: Internal
router.post("/add", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel({
    pid: req.body.pid,
    name: req.body.name,
    price: req.body.price,
  });

  try {
    const savedProduct = await newProduct.save();

    res.status(201).json({
      ...savedProduct._doc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: Fetch products for sellers to add to catalog
// @route: GET localhost:5000/api/proudcts/
// @access: Public
router.get("/", async (req, res) => {
  try {
    let limit;
    let result = [];

    req.query.limit ? (limit = req.query.limit) : (limit = 10);

    const products = await ProductModel.find().limit(limit);

    for (let item in products) {
      result.push({
        Id: products[item].pid,
        Name: products[item].name,
        Price: products[item].price,
      });
    }
    res.status(200).json({
      products: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
export { router as productRoute };
