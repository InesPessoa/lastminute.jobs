const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Job = require("./../models/jobModel");
const Application = require("./../models/applicationModel");

validateApplication = async (req, next) => {
  //validate the application
  let application;
  try {
    application = await Application.findById(req.params.id);
  } catch {
    application = null;
  }
  if (!application) {
    return next(new AppError("The application doesn't exist", 404));
  }
  //verify the status of the application
  if (application.status != "open") {
    return next(new AppError("The application is not open", 400));
  }
  return application;
};

validateBeforeEditByEmployer = async (req, next) => {
  const application = await validateApplication(req, next);

  //validation that the job belongs to them
  const employerId = req.user.id;
  if (application.employerId != employerId) {
    return next(new AppError("Your ID doen't match the employer ID", 400));
  }
  //validate if the job is still open
  let job;
  try {
    job = await Job.findById(application.jobId);
  } catch {
    job = null;
  }
  //confirm that the job exists, and is open, confirm the execution date
  if (!job) {
    return next(new AppError("Thejob doesn't exist", 400));
  }
  if (job.status != "open") {
    return next(new AppError("The job is no longer open", 400));
  }
  if (job.executionDate < Date.now()) {
    return next(new AppError("The job has expired", 400));
  }
  return application;
};

exports.apply = catchAsync(async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole != "employee") {
    return next(
      new AppError(
        "The user needs to be an employee to apply to a job role",
        403
      )
    );
  }
  //get job by id
  let job;
  try {
    job = await Job.findById(req.params.id);
  } catch {
    job = null;
  }
  //confirm that the job exists, and is open, confirm the execution date
  if (!job) {
    return next(new AppError("Thejob doesn't exist", 404));
  }
  if (job.status != "open") {
    return next(new AppError("The job is no longer open", 400));
  }
  if (job.executionDate < Date.now()) {
    return next(new AppError("The job has expired", 400));
  }

  //verify if you are already applied
  let application = await Application.find({
    employeeId: req.user._id,
    jobId: job._id,
  });
  if (application.length > 0) {
    return next(
      new AppError("There is already one application for this job", 400)
    );
  }

  //create the application
  application = await Application.create({
    employerId: job.employerId,
    employeeId: req.user._id,
    jobId: job._id,
  });

  //update the job, n applications, sum 1
  await Job.update(
    { _id: req.params.id },
    { nApplications: job.nApplications + 1 }
  );
  job = await Job.findById(req.params.id);

  //send back the response
  res.status(201).json({
    status: "success",
    data: {
      application,
      job,
    },
  });
});

exports.getApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

exports.deleteApplication = catchAsync(async (req, res, next) => {
  //validate application
  let application = await validateApplication(req, next);

  application.active = false;
  await Application.update({ _id: req.params.id }, { active: false });

  //TODO validate job
  let job = await Job.findById(application.jobId);
  await Job.update(
    { _id: application.jobId },
    { nApplications: job.nApplications - 1 }
  );
  job = await Job.findById(application.jobId);

  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

exports.listAllApplication = catchAsync(async (req, res, next) => {
  const applications = await Application.find();
  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  });
});

exports.listJobApplications = catchAsync(async (req, res, next) => {
  //validate job
  let job;
  try {
    job = await Job.findById(req.params.id);
  } catch {
    job = null;
  }
  //confirm that the job exists, and is open, confirm the execution date
  if (!job) {
    return next(new AppError("The job doesn't exist", 400));
  }
  const applications = await Application.find()
    .where("jobId")
    .equals(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  });
});

exports.listEmployeeApplications = catchAsync(async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole != "employee") {
    return next(
      new AppError(
        "The user needs to be an employee to see their aplications",
        403
      )
    );
  }
  const applications = await Application.find()
    .where("employeeId")
    .equals(req.user._id);
  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  });
});

exports.applicationStatus = catchAsync(async (req, res, next) => {
  let applicationStatus;
  try {
    applicationStatus = req.body.applicationStatus;
  } catch {
    next(new AppError("Please send the applicationStatus", 400));
  }

  //validate the application
  let application = await validateBeforeEditByEmployer(req, next);
  await Application.update(
    { _id: application._id },
    { status: applicationStatus }
  );

  //if n applications of filled, then fill the job

  let job = await Job.findById(application.jobId);

  if (applicationStatus == "accepted") {
    let employeeId = job.employeeId;
    employeeId.push(application.employeeId);
    let status = job.status;
    console.log(employeeId.length, job.nPositions);
    if (employeeId.length == job.nPositions) {
      status = "filled";
    }
    await Job.update(
      { _id: job._id },
      { status: status, employeeId: employeeId }
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      application,
      job,
    },
  });
});
