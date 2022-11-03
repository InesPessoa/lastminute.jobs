const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  employerId: {
    type: String, //TODO replace with reference
    required: [true, "A job needs an employer id associated."],
  },
  employeeId: {
    type: [String], //TODO replace with reference
    default: [],
  },
  nPositions: {
    type: Number,
    required: [true, "PLease provide the number of positions open."],
  },
  description: String,
  postDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
  },
  executionDate: {
    type: Date,
    required: [true, "Please provide an execution date"],
  },
  hourlyRate: {
    type: Number,
    required: [true, "Please confirm your hourly rate"],
  },
  currency: {
    type: String,
    required: [true, "Please provide the currency."],
    enum: ["euro", "dolar", "bitcoin", "ethereum"],
  },
  nHours: {
    type: Number,
    required: [true, "Please give the number of hours this job will require."],
  },
  nApplications: {
    type: Number,
    default: 0,
  },
  category: [String],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  status: {
    type: String,
    required: [true, "Please provide the status of the job."],
    default: "open",
    enum: ["open", "filled", "completed"],
  },
});

jobSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//TODO update date of change
jobSchema.pre(/^update/, function (next) {
  this.updateDate = Date.now();
  next();
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
