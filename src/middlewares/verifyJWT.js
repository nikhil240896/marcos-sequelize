const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { JWT_SECRET } = process.env;
const User = require("../db/models/user");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(new AppError("Unauthorised Request", 400));

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decodedToken?.id, {
      attributes: { exclude: ["password", "deletedAt"] },
    });

    if (!user) return next(new AppError("Invalid Token", 400));
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError(`error in User Token : ${error.message}`, 400));
  }
});

const restrictTo = (...allowedUsers) => {
  return (req, _, next) => {
    if (!allowedUsers.includes(req.user.userType)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = { verifyJWT, restrictTo };
