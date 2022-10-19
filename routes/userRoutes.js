const express = require("express");
const User = require("../models/userModel");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/singup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.get("/getMe", authController.protect, userController.getMe);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

//get user by id

router.get("/getUsers", 
  authController.protect, userController.getAllUsers);

router.get("/getEmployees",
 authController.protect, userController.getEmployees);

router.get("/getEmployers",
 authController.protect, userController.getEmployers);

// path comment
// path rating

module.exports = router;

