const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.route("/:id").get(authController.protect, reviewController.getReview);

router
  .route("/")
  .post(authController.protect, reviewController.createReview)
  .get(authController.protect, reviewController.listAllReviews);

module.exports = router;
