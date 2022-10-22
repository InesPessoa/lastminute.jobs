const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Job = require("./../models/jobModel");
const Application = require("./../models/applicationModel")

exports.apply = catchAsync(async (req, res, next) => {
    const userRole = req.user.role;
    if (userRole!="employee"){
        return next(new AppError("The user needs to be an employee to apply to a job role", 400));
    }
    //get job by id
    let job;
    try{
        job = await Job.findById(req.params.id);
    } catch{
        job = null;
    }
     //confirm that the job exists, and is open, confirm the execution date
    if (!job){
        return next(new AppError("Thejob doesn't exist", 400))
    }
    if (job.status!="open"){
        return next(new AppError("The job is no longer open", 400))
    }
    if (job.executionDate < Date.now()){
        return next(new AppError("The job has expired", 400))
    }

    //create the application
    const application = await Application.create({"employerId": job.employerId,
     "employeeId": req.user._id,
      "jobId": job._id})

    //update the job, n applications, sum 1
    await Job.update({_id: req.params.id}, {"nApplications": job.nApplications + 1});

    //send back the response
    res.status(201).json({
      status: "success",
      data: {
        application: application,
      },
    });
  });

  exports.deleteApplication = catchAsync(async (req, res, next) => {
   //TODO
   //only available to delete is status is not accepted
   //if status accepted, contact the employer
   //update active to false
   //subtract one to the applications
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
    //validation that the job belongs to them
    //if n applications of filled, then fill the job
   });

   exports.declineApplications = catchAsync(async (req, res, next) => {
    //TODO
    //validation that the job belongs to them
    //only able to decline an offer that was not ben accepted before
   });