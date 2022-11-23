const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./../controllers/handlerFactory");
const FormatResponse = require("../utils/formatResponse");
const { filterObj } = require("./../utils/editRequest");
const url = require("url");

getAllUsers = async (req, res, query, next) => {
  const apiFeatures = new FormatResponse(query, req.query)
    .limitFields()
    .paginate();

  const users = await apiFeatures.query;

  res.status(200).json({
    status: "sucess",
    requestedAt: req.requestTime,
    data: { users: users },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if the user posts password data
  if (
    req.body.hasOwnProperty("password") ||
    req.body.hasOwnProperty("passwordConfirm")
  ) {
    return next(
      new AppError(
        "This route is not for password updates. Please use updateMyPassword",
        400
      )
    );
  }

  // filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "email",
    "role",
    "comments",
    "rating",
    "commentsGiven",
    "ratingGiven" //Todo add password related fields
  ); //listed only allowed fields to be updated

  //update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidatoes: true,
  });
  res.status(200).json({
    status: "sucess",
    data: { user: updateUser },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "sucess",
    user: req.user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

exports.getAllUsersByRole = catchAsync(async (req, res, next) => {
  const queryObject = url.parse(req.url, true).query;
  let role;
  try {
    role = queryObject.role;
  } catch {
    role = null;
  }
  console.log(role);
  if (!role) {
    getAllUsers(req, res, User.find(), next);
  } else if (role == "employee") {
    getAllUsers(req, res, User.find().where("role").equals("employee"), next);
  } else {
    getAllUsers(req, res, User.find().where("role").equals("employer"), next);
  }
});

exports.listAllUsers = factory.getAll(User);
