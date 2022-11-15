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
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

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

//limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. please try again in an hour!",
});

app.use("/api", limiter);

//body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

//data sanitization against NoSql query injection
app.use(mongoSanitize());

//data sanitization agains XSS
app.use(xss());

//prevent parametar polution
app.use(
  hpp({
    whitelist: [
      // "example",
    ],
  })
);

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
