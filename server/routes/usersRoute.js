const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
<<<<<<< HEAD
const adminMiddleware = require("../middleware/adminMiddleware");

// Valid bcrypt hash used only to normalize timing when email is not found
const DUMMY_HASH =
  "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31jW";
=======

>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e

//new user Registeration
router.post("/register", async (req, res) => {
  try {
    //check if user already exists by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("User already exists");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
<<<<<<< HEAD

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
=======
    req.body.password = hashedPassword;

    //save user
    const newUser = new User(req.body);
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    await newUser.save();
    res.send({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//user login
router.post("/login", async (req, res) => {
<<<<<<< HEAD
  const genericError = () =>
    res.send({
      success: false,
      message: "Invalid email or password",
    });
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      await bcrypt.compare(req.body.password || "", DUMMY_HASH);
      return genericError();
    }
    if (user.status !== "active") {
      return res.send({
        success: false,
        message: "The user account is blocked , please contact admin",
      });
    }
=======
  try {
    //check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User Not Found");
    }
     // if user is active
     if (user.status !== "active") {
      throw new Error("The user account is blocked , please contact admin");
    }
    //compare password
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
<<<<<<< HEAD
      return genericError();
    }
=======
      throw new Error("Invalid Password");
    }
    //create and assign token
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "30d",
    });

<<<<<<< HEAD
=======
    //send response
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    res.send({
      success: true,
      message: "User Logged in Successfully",
      data: token,
    });
  } catch (error) {
<<<<<<< HEAD
    return genericError();
  }
});

});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
=======
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get current user
router.get("/get-current-user", authMiddleware,async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all users
<<<<<<< HEAD
router.get("/get-users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
=======
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update user status
<<<<<<< HEAD
router.put(
  "/update-user-status/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      await User.findByIdAndUpdate(req.params.id, { status });
      res.send({
        success: true,
        message: "User status updated successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);
=======
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e

module.exports = router;
