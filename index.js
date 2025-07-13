require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 4000;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
    process.exit(1); // Exit the process to avoid running in an unstable state
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

// create .sequelizerc on your project root directory
// install npm install --save-dev sequelize-cli
// npx sequelize-cli init // Initialize Sequelize configuration and directories
// npx sequelize-cli db:create // Create the database defined in config/config.js