const mongoose = require("mongoose");

//id, name, email, password, passwordConfirm, type, category, description,
//createdat, lastlogin, location, status, comments, rating;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  type: String,
  category: String,
  description: String,
  location: String,
  status: String,
  comments: [String],
  rating: [Number],
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  lastlogin: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
