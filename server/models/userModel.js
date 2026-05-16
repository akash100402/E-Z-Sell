const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
<<<<<<< HEAD
      select: false,
=======
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "active",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

=======
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
const User = mongoose.model("users", userSchema);

module.exports = User;
