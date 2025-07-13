const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const user = require("../db/models/user");
const { Sequelize } = require("sequelize");

const getAllUsers = asyncHandler(async (req, res, next) => {
  const { count, rows } = await user.findAndCountAll({
    where: { userType: { [Sequelize.Op.ne]: "0" } },
    attributes: { exclude: ["password"] },
  });

  res.status(200).json({
    status: "success",
    totalUsers: count, // Total number of users excluding admins
    users: rows, // Actual user data
  });
});

module.exports = { getAllUsers };
