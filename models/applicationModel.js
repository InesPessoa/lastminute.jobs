const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An appplication needs an employer id associated."],
  },
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An appplication needs an employee id associated."],
  },
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
    required: [true, "An appplication needs a job id associated."],
  },
  dateSubmited: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  status: {
    type: String,
    required: [true, "Please provide the status of the job."],
    default: "open",
    enum: ["open", "accepted", "rejected"],
  },
});

applicationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "employerId",
    select: "-__v",
  })
    .populate({
      path: "employeeId",
      select: "-__v",
    })
    .populate({
      path: "jobId",
      select: "-__v",
    });
  next();
});

applicationSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
