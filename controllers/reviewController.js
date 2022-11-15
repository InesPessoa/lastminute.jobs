const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Job = require("./../models/jobModel");
const Application = require("./../models/applicationModel");
const Review = require("./../models/reviewModel");

//Todo create review

//get review by id

//get reviews

exports.createReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  let jobId;
  try {
    jobId = req.body.jobId;
    console.log(jobId);
  } catch {
    return next(new AppError("Please send the application Id", 400));
  }
  const job = await Job.findById(jobId);
  console.log(job._id);
  if (job.executionDate > Date.now()) {
    return next(new AppError("The job didn't happen yet", 400));
  }
  const userRole = req.user.role;
  if (userRole == "employee") {
    if (job.employeeId != userId) {
      return next(new AppError("The user is not an employee on the job", 400));
    }
  } else if (userRole == "employer") {
    console.log(job.employerId._id);
    if (job.employerId._id != userId) {
      return next(new AppError("The user is not an employer on the job", 400));
    }
  }

  //create the review
  const review = await Review.create({
    userId: userId,
    jobId: jobId,
    comment: req.body.comment,
    rating: req.body.rating,
  });

  //send back the response
  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.listAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
