import { Router } from "express";
import CryptoJS from "crypto-js";
import { RoleModel } from "../models/Role.js";
import { generateAccessToken } from "../utils/generateToken.js";

const router = Router();

// @desc: Registration for Internal access
// @route: localhost:5000/api/internal/register
// @access: Internal
router.post("/register", async (req, res) => {
  let isAdmin;

  if ("isAdmin" in req.body) {
    isAdmin = req.body.isAdmin;
  } else {
    isAdmin = false;
  }

  const newUser = new RoleModel({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSPHRASE
    ).toString(),
    isAdmin: isAdmin,
  });

  try {
    const savedUser = await newUser.save();

    res.status(201).json({
      ...savedUser._doc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: Login for Internal access
// @route: localhost:5000/api/internal/login
// @access: Internal
router.post("/login", async (req, res) => {
  try {
    const user = await RoleModel.findOne({ username: req.body.username });

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
      // @params: (id, isAdmin, isInternal)
      const accessToken = generateAccessToken(user._id, user.isAdmin, true);

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, accessToken });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as internalRoute };
