const app = require("./app");

// Start Server
const port = process.env.PORT || 8002;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
