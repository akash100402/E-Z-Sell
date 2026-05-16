const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/notificationsModel");
<<<<<<< HEAD
const Product = require("../models/productModel");

// add a notification (recipient derived from product when provided)
router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const { title, message, onClick, product: productId } = req.body;
    if (!title || !message || !onClick) {
      throw new Error("Missing required fields");
    }
    let recipientId = null;
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      recipientId = product.seller;
    }
    if (!recipientId) {
      throw new Error("Invalid notification target");
    }

    const newNotification = new Notification({
      title,
      message,
      onClick,
      user: recipientId,
      read: false,
    });
=======

// add a notification
router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    await newNotification.save();
    res.send({
      success: true,
      message: "Notification added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all notifications by user
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
<<<<<<< HEAD
      user: req.userId,
=======
      user: req.body.userId,
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a notification
router.delete("/delete-notification/:id", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    const removed = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!removed) {
      return res.send({
        success: false,
        message: "Notification not found",
      });
    }
=======
    await Notification.findByIdAndDelete(req.params.id);
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    res.send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// read all notifications by user
router.put("/read-all-notifications", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
<<<<<<< HEAD
      { user: req.userId, read: false },
=======
      { user: req.body.userId, read: false },
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
      { $set: { read: true } }
    );
    res.send({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
