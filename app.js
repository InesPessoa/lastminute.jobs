const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes.js");
const jobRouter = require("./routes/jobRoutes");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server!`, 404));
});

app.use(errorHandler);

module.exports = app;
