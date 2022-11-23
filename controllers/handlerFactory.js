const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filters = {};
    if (req.params.userId) filters = { userId: req.params.userId };
    const apiFeatures = new APIFeatures(Model.find(filters), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await apiFeatures.query;

    res.status(200).json({
      status: "sucess",
      requestedAt: req.requestTime,
      data: docs,
    });
  });
