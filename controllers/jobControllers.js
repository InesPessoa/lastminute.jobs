const Job = require("./../models/jobModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createJob = catchAsync(async (req, res, next) => {
    //confirm is an employer, needs to be an employer to post a job
    const userRole = req.user.role;
    if (userRole!="employer"){
        return next(new AppError("The user needs to be an employer to be able to post a job", 400));
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

  //TODO GET JOBS

  //TODO GET A JOB By ID

  //TODO get jobs of an employee (active + inactive)

  //TODO update job (only available for jobs that belong to a certain user)

  //TODO delete a job

  //TODO cron job to check the date of the job and change the status