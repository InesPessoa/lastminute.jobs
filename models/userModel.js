const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 *  components:
 *    schemas:
 *      user:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Manager address
 *          email:
 *            type: string
 *            description: Manager username or null
 *          role:
 *            type: string
 *            description: True if manager deleted account
 */

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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    required: [true, "Please provide your role"],
    enum: ["employer", "employee"],
  },
  passwordChangedAt: Date, //TODO select false
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    select: false,
  },
  passwordResetToken: String, //TODO select false
  passwordResetExpires: Date, //TODO select false
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  category: [String],
  description: String,
  location: String,
  comments: [String],
  ratings: [Number],
  commentsGiven: { type: { id: String, comment: String }, select: false },
  ratingsGiven: { type: { id: String, rating: Number }, select: false },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // works for 10 min
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
