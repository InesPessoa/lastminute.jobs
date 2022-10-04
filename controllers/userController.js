const User = require("./../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "sucess",
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err,
      message: "Something went wrong",
    });
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      status: "sucess",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err,
      message: "Something went wrong",
    });
  }
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
