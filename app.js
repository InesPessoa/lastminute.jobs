const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes.js");
const jobRouter = require("./routes/jobRoutes");
const applicationRouter = require("./routes/applicationRoutes");
const reviewsRouter = require("./routes/reviewRoutes");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Last Minute API",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      api_auth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        scopes: {
          write: "modify",
          read: "read",
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server!`, 404));
});

app.use(errorHandler);

module.exports = app;
