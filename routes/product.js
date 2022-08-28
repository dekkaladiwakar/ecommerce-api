import { Router } from "express";
import { verifySellerToken, verifyTokenAndAdmin } from "./verifyToken.js";
import { ProductModel } from "../models/Product.js";

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
// @route: GET localhost:5000/api/proudcts/{sellerId}
// @access: Private
router.get("/:id", verifySellerToken, async (req, res) => {
  try {
    let limit;
    let result = [];

    req.query.limit ? (limit = req.query.limit) : (limit = 10);

    const products = await ProductModel.find().limit(limit);

    for (let item in products) {
      result.push({
        id: products[item]._id,
        productId: products[item].pid,
        name: products[item].name,
        price: products[item].price,
      });
    }
    res.status(200).json({
      limit: limit,
      products: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
export { router as productRoute };
