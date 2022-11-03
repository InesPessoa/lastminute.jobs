const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  employerId: {
    type: String, // Todo replace with reference
    required: [true, "An appplication needs an employer id associated."],
  },
  employeeId: {
    type: String, // Todo replace with reference
    required: [true, "An appplication needs an employee id associated."],
  },
  jobId: {
    type: String, // Todo replace with reference
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
  this.find({ active: { $ne: false } });
  next();
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
