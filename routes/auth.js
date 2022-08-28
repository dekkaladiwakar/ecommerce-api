import { Router } from "express";
import { BuyerModel } from "../models/Buyer.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { SellerModel } from "../models/Seller.js";
import { generateAccessToken } from "../utils/generateToken.js";

const router = Router();

// @desc: Registration for Buyers and Sellers
// @route: localhost:5000/api/auth/register
// @access: Public
router.post("/register", async (req, res) => {
  let newUser;
  if (req.body.type == "B") {
    newUser = new BuyerModel({
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSPHRASE
      ).toString(),
    });
  } else if (req.body.type == "S") {
    newUser = new SellerModel({
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSPHRASE
      ).toString(),
    });
  }

  try {
    const savedUser = await newUser.save();

    // Generate access token after user is created
    const accessToken = generateAccessToken(savedUser._id, {
      isSeller: savedUser.isSeller,
    });

    res.status(201).json({
      ...savedUser._doc,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// @desc: Login for Buyers & Sellers
// @route: localhost:5000/api/auth/login
// @access: Public
router.post("/login", async (req, res) => {
  try {
    let user;

    if (req.body.type == "B") {
      user = await BuyerModel.findOne({ email: req.body.email });
    } else if (req.body.type == "S") {
      user = await SellerModel.findOne({ email: req.body.email });
    }

    if (!user) {
      res.status(401).json({ msg: "Wrong Credentials" });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSPHRASE
    );

    const originPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // Generate access token if password matches
    if (originPassword != req.body.password) {
      res.status(401).json({ msg: "Wrong Credentials" });
    } else {
      const accessToken = generateAccessToken(user._id, {
        isSeller: user.isSeller,
      });

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, accessToken });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as authRoute };
