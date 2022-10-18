const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowerdFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowerdFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if the user posts password data
  if (req.body.password || req.body.passwordConfig) {
    return next(
      new AppError(
        "This route is not for password updates. Please use updateMyPassword",
        400
      )
    );
  }
  // filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

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


exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});
