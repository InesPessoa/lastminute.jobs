const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A review needs an user associated."],
  },
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
    required: [true, "A review needs a job associated."],
  },
  comment: {
    type: String,
    required: [true, "A review needs a comment associated."],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "A review needs a rating associated."],
  },
  dateSubmited: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "-__v",
  }).populate({
    path: "jobId",
    select: "-__v",
  });
  next();
});

//prevent duplicated reviews
reviewSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
