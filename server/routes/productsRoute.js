const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const Notification = require("../models/notificationsModel");

async function assertCanModifyProduct(productId, userId) {
  const [product, user] = await Promise.all([
    Product.findById(productId),
    User.findById(userId).select("role"),
  ]);
  if (!product) {
    throw new Error("Product not found");
  }
  const isOwner = product.seller.toString() === userId.toString();
  const isAdmin = user && user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new Error("Not authorized to modify this product");
  }
  return product;
}

function sanitizeProductUpdates(body, isAdmin) {
  const allowed = [
    "name",
    "description",
    "price",
    "category",
    "age",
    "images",
    "billAvailable",
    "warrantyAvailable",
    "accessoriesAvailable",
    "boxAvailable",
    "showBidsOnProductPage",
  ];
  const out = {};
  for (const k of allowed) {
    if (body[k] !== undefined) {
      out[k] = body[k];
    }
  }
  if (isAdmin) {
    if (body.status !== undefined) {
      out.status = body.status;
    }
    if (body.seller !== undefined) {
      out.seller = body.seller;
    }
  }
  return out;
}

//add new product
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.userId;
    const currentUser = await User.findById(sellerId).select("name");
    const newProduct = new Product({
      ...req.body,
      seller: sellerId,
    });
    await newProduct.save();

    const admins = await User.find({ role: "admin" });
    const sellerLabel = currentUser && currentUser.name ? currentUser.name : "A seller";
    for (const admin of admins) {
      await new Notification({
        user: admin._id,
        message: `New product added by ${sellerLabel}`,
        title: "New Product",
        onClick: `/admin`,
        read: false,
      }).save();
    }

    res.send({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all products
router.post("/get-products", authMiddleware, async (req, res) => {
  try {
    const { seller, category = [], age = [], status } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }
    if (category.length > 0) {
      filters.category = { $in: category };
    }

    if (age.length > 0) {
      age.forEach((item) => {
        const fromAge = item.split("-")[0];
        const toAge = item.split("-")[1];
        filters.age = { $gte: fromAge, $lte: toAge };
      });
    }

    const products = await Product.find(filters)
      .populate("seller")
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get a product by id
router.get("/get-product-by-id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await assertCanModifyProduct(req.params.id, req.userId);
    const user = await User.findById(req.userId).select("role");
    const updates = sanitizeProductUpdates(req.body, user.role === "admin");
    await Product.findByIdAndUpdate(req.params.id, updates);
    res.send({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await assertCanModifyProduct(req.params.id, req.userId);
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safe = String(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/upload-image-to-product",
  authMiddleware,
  imageUpload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }
      const productId = req.body.productId;
      await assertCanModifyProduct(productId, req.userId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "chickCycle",
      });

      fs.unlink(req.file.path, () => {});

      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, () => {});
      }
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

router.put(
  "/update-product-status/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      const newNotification = new Notification({
        user: updatedProduct.seller,
        message: `Your product ${updatedProduct.name} has been ${status}`,
        title: "Product Status Updated",
        onClick: `/profile`,
        read: false,
      });

      await newNotification.save();
      res.send({
        success: true,
        message: "Product status updated successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
