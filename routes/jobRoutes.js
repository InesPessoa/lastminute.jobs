const express = require("express");
const authController = require("./../controllers/authController");
const jobController = require("./../controllers/jobControllers");

const router = express.Router();

router.post("/createJob", authController.protect, jobController.createJob);

module.exports = router;

