const router = require("express").Router();
const Bid = require("../models/bidModel");
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
    await newBid.save();
    res.send({ success: true, message: "Bid placed successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get all bids
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  try {
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
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;
