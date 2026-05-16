const User = require("../models/userModel");

/** Requires authMiddleware first. Ensures user.role === "admin". */
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: "Admin access required",
    });
  }
};
