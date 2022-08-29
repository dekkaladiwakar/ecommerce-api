import { Router } from "express";
import { CatalogModel } from "../models/Catalog.js";
import { verifyBuyerToken, verifySellerToken } from "./verifyToken.js";

const router = Router();

// @desc: seller creates a catalog by adding products
// @route: POST localhost:5000/api/catalog/seller/{sellerId}/create
// @access: Private (Seller)
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

// @desc: fetches sellers with catalogs
// @route: GET localhost:5000/api/catalog/buyer/sellers-list
// @access: Private (Byter)
router.get("/buyer/sellers-list", verifyBuyerToken, async (req, res) => {
  try {
    let limit;
    let sellerList = [];

    req.query.limit ? (limit = req.query.limit) : (limit = 10);

    const catalogs = await CatalogModel.find().limit(limit);

    for (let item in catalogs) {
      sellerList.push(catalogs[item].seller);
    }

    res.status(200).json({
      limit: limit,
      sellerList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// @desc: fetches prodcuts in catalog of a seller based on sellerId
// @route: GET localhost:5000/api/catalog/buyer/{sellerId}
// @access: Private (Buyer)
router.get("/buyer/:id", verifyBuyerToken, async (req, res) => {
  try {
    const catalogs = await CatalogModel.findOne({
      seller: req.params.id,
    }).populate("products");

    let catalogItems = [];

    if ("products" in catalogs) {
      catalogItems = catalogs.products;
    }

    res.status(200).json({
      catalogItems,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as catalogRoute };
