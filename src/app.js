const express = require("express");
const cors = require("cors");
const helmet = require('helmet');

const authRouter = require("./routes/authRoute");
const projectRouter = require("./routes/projectRoute");
const userRouter = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(helmet());

app.get("/", async (_, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use('/api/v1/users', userRouter);

app.use("*",(req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

app.use(globalErrorHandler); //global error handler middleware
module.exports = app;