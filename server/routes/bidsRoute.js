const router = require("express").Router();
const Bid = require("../models/bidModel");
<<<<<<< HEAD
const Product = require("../models/productModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// place a new bid
router.post("/place-new-bid", authMiddleware, async (req, res) => {
  try {
    const { bidAmount, message, mobile, product: productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const newBid = new Bid({
      bidAmount,
      message,
      mobile,
      product: product._id,
      seller: product.seller,
      buyer: req.userId,
    });
=======
const authMiddleware = require("../middleware/authMiddleware");

// place a new bid
router.post("/place-new-bid", authMiddleware , async (req, res) => {
  try {
    const newBid = new Bid(req.body);
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    await newBid.save();
    res.send({ success: true, message: "Bid placed successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get all bids
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    const { product, seller, buyer } = req.body;
    const user = await User.findById(req.userId).select("role");
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    const conditions = [];

    if (user.role !== "admin") {
      conditions.push({
        $or: [{ buyer: req.userId }, { seller: req.userId }],
      });
    }

    const fieldFilters = {};
    if (product) {
      fieldFilters.product = product;
    }
    if (seller) {
      fieldFilters.seller = seller;
    }
    if (buyer) {
      fieldFilters.buyer = buyer;
    }
    if (Object.keys(fieldFilters).length) {
      conditions.push(fieldFilters);
    }

    const filters = conditions.length > 1 ? { $and: conditions } : conditions[0];

    const bids = await Bid.find(filters || {})
      .populate("product")
      .populate("buyer")
      .populate("seller")
      .sort({ createdAt: -1 });
=======
    const { product, seller, buyer} = req.body;
    let filters = {};
    if (product) {
      filters.product = product;
    }
    if (seller) {
      filters.seller = seller;
    }
    if (buyer) {
      filters.buyer = buyer
    }

    const bids = await Bid.find(filters)
      .populate("product")
      .populate("buyer")
      .populate("seller").sort({ createdAt: -1 });
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

<<<<<<< HEAD
module.exports = router;
=======

module.exports = router;
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
