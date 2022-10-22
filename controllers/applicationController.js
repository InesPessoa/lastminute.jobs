const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.apply = catchAsync(async (req, res, next) => {
    const userRole = req.user.role;
    if (userRole!="employee"){
        return next(new AppError("The user needs to be an employee to apply to a job role", 400));
    }

    //get job by id

    //confirm that the job exists, and is open, confirm the execution date

    //create the application

    //update the job, n applications, sum 1

    //send back the response
    res.status(201).json({
      status: "success",
      data: {
        job: newJob,
      },
    });
  });

  exports.deleteApplication = catchAsync(async (req, res, next) => {
   //TODO
  });


  exports.listAllApplication = catchAsync(async (req, res, next) => {
    //TODO
   });

   exports.listJobApplications = catchAsync(async (req, res, next) => {
    //TODO
   });

   exports.listMyApplications = catchAsync(async (req, res, next) => {
    //TODO
   });

   exports.acceptApplications = catchAsync(async (req, res, next) => {
    //TODO
    //if n applications of filled, then fill the job
   });

   exports.declineApplications = catchAsync(async (req, res, next) => {
    //TODO
   });