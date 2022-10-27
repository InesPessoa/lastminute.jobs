const express = require("express");
const User = require("../models/userModel");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/singup:
 *   post:
 *     summary: singup the user in the system
 *     description: creates the user in the database ans returns the token to use on the authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               passwordConfirm:
 *                 type: string
 *                 required: true
 *               role:
 *                 type: string
 *                 required: true
 *               category:
 *                  type: array
 *     responses:
 *       '201':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/user'
 *
 */
router.post("/singup", authController.signup);

router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/me")
  .get(authController.protect, userController.getMe)
  .patch(authController.protect, userController.updateMe)
  .delete(authController.protect, userController.deleteMe);

//TODO transform the last 3 endpoints into 1
router.get("/employees", authController.protect, userController.getEmployees);

router.get("/employers", authController.protect, userController.getEmployers);

/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     summary:
 *     description:
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 password:
 *                   type: string
 *                 passwordConfirm:
 *                   type: string
 *     security:
 *       - api_auth:
 *       - "write:modify":
 */
router.get("/", authController.protect, userController.getAllUsers);

//TODO post a comments and rating

module.exports = router;
