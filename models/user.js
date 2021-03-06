const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    bloodgroup: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
