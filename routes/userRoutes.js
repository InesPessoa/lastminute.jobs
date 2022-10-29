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

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: login the user in the system
 *     description: given the credentials, the endpoint returns the token, so the user can authenticate in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *     responses:
 *       '200':
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
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: allows the user to reset the password
 *     description: sends a token to the email so the user can use it to reset the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post("/forgotPassword", authController.forgotPassword);

/**
 * @swagger
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: allows the user to reset the password
 *     description: sends a token to the email so the user can use it to reset the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 required: true
 *               passwordConfirm:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
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
 */
router.patch("/resetPassword/:token", authController.resetPassword);

/**
 * @swagger
 * /api/v1/users/updateMyPassword:
 *   patch:
 *     summary: allows the user to update the password
 *     description: replaces the password with the new one that was send.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               passwordConfirm:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
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
 *     security:
 *       - api_auth:
 *       - "write:modify":
 */
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/me")
  /**
   * @swagger
   * /api/v1/users/me:
   *   get:
   *     summary: allows the user get their information
   *     description: replaces the password with the new one that was send.
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 user:
   *                   $ref: '#/components/schemas/user'
   *     security:
   *       - api_auth:
   *       - "write:modify":
   */
  .get(authController.protect, userController.getMe)

  /**
   * @swagger
   * /api/v1/users/me:
   *   patch:
   *     summary: allows the user to update the password
   *     description: replaces the password with the new one that was send.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               category:
   *                 type: string
   *               descriprion:
   *                 type: string
   *              location:
   *                 type: string
   *     responses:
   *       '200':
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
   *     security:
   *       - api_auth:
   *       - "write:modify":
   */
  .patch(authController.protect, userController.updateMe)

  /**
   * @swagger
   * /api/v1/users/me:
   *   delete:
   *     summary: allows the user get their information
   *     description: replaces the password with the new one that was send.
   *     responses:
   *       '204':
   *     security:
   *       - api_auth:
   *       - "write:modify":
   */
  .delete(authController.protect, userController.deleteMe);

/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     summary:
 *     description:
 *     parameters:
 *     - in: query
 *       name: role
 *       type: string
 *       description:  The role of the employee.
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
