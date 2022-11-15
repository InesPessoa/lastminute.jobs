const Job = require("./../models/jobModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const FormatResponse = require("../utils/formatResponse");
const User = require("../models/userModel");
const { filterObj } = require("./../utils/editRequest");

checkJobBelgonsToEmployer = async (req) => {
  const employerId = req.user.id;
  let job;
  try {
    job = await Job.findById(req.params.id);
  } catch {
    job = null;
  }
  if (!job) {
    return new AppError("No job found with that id", 404);
  }
  if (job.employerId != employerId) {
    return new AppError("The job doesn't belong to the user logged in", 404);
  }
  return job;
};
//move this to utils
getAll = async (req, res, query, next) => {
  const apiFeatures = new FormatResponse(query, req.query)
    .limitFields()
    .paginate();

  const jobs = await apiFeatures.query;

  res.status(200).json({
    status: "sucess",
    requestedAt: req.requestTime,
    data: { jobs: jobs },
  });
};

exports.createJob = catchAsync(async (req, res, next) => {
  //confirm is an employer, needs to be an employer to post a job
  const userRole = req.user.role;
  if (userRole != "employer") {
    return next(
      new AppError(
        "The user needs to be an employer to be able to post a job",
        400
      )
    );
  }

  //register the employer Id
  req.body.employerId = req.user.id;

  //create the job
  const newJob = await Job.create(req.body);

  //send back the response
  res.status(201).json({
    status: "success",
    data: {
      job: newJob,
    },
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  getAll(req, res, Job.find(), next);
});

//get all the open jobs and with date bigget than now
exports.getOpenJobs = catchAsync(async (req, res, next) => {
  getAll(req, res, Job.find().where("status").equals("open"), next);
});

// get jobs of an employee (active)
exports.getMyJobs = catchAsync(async (req, res, next) => {
  getAll(req, res, Job.find().where("employerId").equals(req.user.id), next);
});

exports.getJob = catchAsync(async (req, res, next) => {
  let job;
  try {
    job = await Job.findById(req.params.id);
  } catch (err) {
    job = null;
  }
  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }
  res.status(200).json({
    status: "sucess",
    data: { job: job },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await checkJobBelgonsToEmployer(req);
  const filteredBody = filterObj(req.body, "description", "hourlyRate"); //the ourly rate can only be higher
  const hourlyRate = req.body.hourlyRate;
  if (req.body.hasOwnProperty("hourlyRate") && hourlyRate < job.hourlyRate) {
    return next(new AppError("The hourly rate can only be higher", 400));
  }
  await Job.update({ _id: req.params.id }, filteredBody);
  const updatedJob = await Job.findById(req.params.id);
  res.status(200).json({
    status: "sucess",
    job: updatedJob,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = checkJobBelgonsToEmployer(req);
  job.active = false;
  await Job.update({ _id: req.params.id }, job);
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

// add nested endpoints to list reviews of a job
