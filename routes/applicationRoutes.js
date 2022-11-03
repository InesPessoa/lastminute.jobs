const express = require("express");
const authController = require("../controllers/authController");
const applicationController = require("../controllers/applicationController");

const router = express.Router();

router
  .route("/myApplications")
  .get(authController.protect, applicationController.listEmployeeApplications);

//TODO nested endpoint, move to jobs
/*
router
  .route("/jobApplications/:id")
  .get(authController.protect, applicationController.listJobApplications);
*/

router
  .route("/status/:id")
  .patch(authController.protect, applicationController.applicationStatus);

router
  .route("/:id")
  .get(authController.protect, applicationController.getApplication)
  .post(authController.protect, applicationController.apply)
  .delete(authController.protect, applicationController.deleteApplication);

router
  .route("/")
  .get(authController.protect, applicationController.listAllApplication);

module.exports = router;
