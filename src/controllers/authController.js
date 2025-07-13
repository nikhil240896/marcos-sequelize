const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const user = require("../db/models/user");

const signup = asyncHandler(async (req, res, next) => {
  const { userType, firstName, lastName, email, password, confirmPassword } = req.body;

  // Validate user input
  // if (!userType || !firstName || !lastName || !email || !password || !confirmPassword) {
  //   return next(new AppError("All fields are required", 400));
  // }

  // Create user in the database
  const newUser = await user.create({
    userType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword // confirmPassword is a virtual field, it won't be stored in the database
  });

  if(!newUser) {
    return next(new AppError("User creation failed", 500));
  }

  const result = newUser.toJSON();
  delete result.password;
  delete result.deletedAt; 

  result.token = newUser.generateToken(); 

  res.status(201).json({
    status: "success",
    data: result
  });
});


const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // Find user by email
  const existingUser = await user.findOne({ where: { email } });
  if (!existingUser) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid email or password", 401));
  }

  const result = existingUser.toJSON();
  delete result.password;
  delete result.deletedAt;

  result.token = existingUser.generateToken();

  res.status(200).json({
    status: "success",
    data: result
  });
});

module.exports = { signup, login }