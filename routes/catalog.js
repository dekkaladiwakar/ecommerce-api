import { Router } from "express";
import { CatalogModel } from "../models/Catalog.js";
import { verifyBuyerToken, verifySellerToken } from "./verifyToken.js";

const router = Router();

// @desc: seller creates a catalog by adding products
// @route: localhost:5000/api/catalog/seller/{sellerId}/create
// @access: Private
router.post("/seller/:id/create", verifySellerToken, async (req, res) => {
  const newCatalog = CatalogModel({
    seller: req.params.id,
    products: req.body.products,
  });

  try {
    const savedCatalog = await newCatalog.save();

    res.status(201).json({
      ...savedCatalog._doc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: fetches catalogs of all sellers
// @route: GET localhost:5000/api/catalog/buyer/
// @access: Private
router.get("/buyer", verifyBuyerToken, async (req, res) => {
  try {
    let limit;

    req.query.limit ? (limit = req.query.limit) : (limit = 10);

    const catalogs = await CatalogModel.find().limit(limit);

    res.status(200).json({
      limit: limit,
      catalogs,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as catalogRoute };
