const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  return res.status(statusCode).json({
    status: status,
    message: message,
    stack: stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  console.log(error.name, error.message, error.stack);

  // when this error is returned means that error is not being handled inside the application
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token", 401);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  return sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
