const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    employerId: {
      type: String,
      required: [true, "An appplication needs an employer id associated."],
    },
    employeeId: {
        type: String,
        required: [true, "An appplication needs an employee id associated."],
    },
    jobId: {
        type: String,
        required: [true, "An appplication needs a job id associated."],
    },
    dateSubmited: {
      type: Date,
      default: Date.now()
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
        enum: ["open", "acepted", "rejected", "canceled"],
    },
  });

  //user needs to have a deposit treshold to apply, cassion

  //only employer or employee can see their applications
  // all employees start with a virtual balance of 100 dolars
  //endpoints for payments
  //employee can only apply if they have a balance equal to the hourly rate * nhours
  //create or delete, for the employee
  //update by employer to uodate the status

  const Application = mongoose.model("Application", jobSchema);
  module.exports = Application;
