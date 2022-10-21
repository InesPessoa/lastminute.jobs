const express = require("express");
const authController = require("./../controllers/authController");
const jobController = require("./../controllers/jobControllers");

const router = express.Router();

router
  .route("/getOpenJobs")
  .get(authController.protect, jobController.getOpenJobs);

router
  .route("/getMyJobs")
  .get(authController.protect, jobController.getMyJobs);

router
  .route("/")
  .get(authController.protect, jobController.getAllJobs)
  .post(authController.protect, jobController.createJob);

router
  .route("/:id")
  .get(authController.protect, jobController.getJob)
  .patch(authController.protect, jobController.updateJob)
  .delete(authController.protect, jobController.deleteJob);

module.exports = router;