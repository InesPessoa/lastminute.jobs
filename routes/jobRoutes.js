const express = require("express");
const authController = require("./../controllers/authController");
const jobController = require("./../controllers/jobControllers");

const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:jobId/reviews", reviewRouter);

router
  .route("/openJobs")
  .get(authController.protect, jobController.getOpenJobs);

router.route("/myJobs").get(authController.protect, jobController.getMyJobs);

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
