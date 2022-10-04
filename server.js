const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//enveronment variables
dotenv.config({ path: "./config.env" });

//connection to database
const DB = process.env.DATABASE.replace(
  "PASSWORD",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected sucessfully!");
  });

// Start Server
const port = process.env.PORT || 8002;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
