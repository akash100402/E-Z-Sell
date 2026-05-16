const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/notificationsModel");
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
      user: req.userId,
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
      { user: req.userId, read: false },
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
