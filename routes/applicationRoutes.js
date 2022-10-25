const express = require("express");
const authController = require("../controllers/authController");
const applicationController = require("../controllers/applicationController");

const router = express.Router();

router
  .route("/employeeApplications")
  .get(authController.protect, applicationController.listEmployeeApplications);

router
  .route("/jobApplications/:id")
  .get(authController.protect, applicationController.listJobApplications);


router
  .route("/accept/:id")
  .patch(authController.protect, applicationController.acceptApplications);

router
  .route("/reject/:id")
  .patch(authController.protect, applicationController.declineApplications);

router
  .route("/:id")
  .get(authController.protect, applicationController.getApplication)
  .post(authController.protect, applicationController.apply)
  .delete(authController.protect, applicationController.deleteApplication);

router
  .route("/")
  .get(authController.protect, applicationController.listAllApplication);

module.exports = router;