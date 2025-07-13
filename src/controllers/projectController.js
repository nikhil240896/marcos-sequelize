const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const project = require("../db/models/project");
const user = require("../db/models/user");

const createProject = asyncHandler(async (req, res, next) => {
  const {
    title,
    productImage,
    price,
    shortDescription,
    description,
    productUrl,
    category,
    tags,
  } = req.body;

  // Create project in the database
  const newProject = await project.create({
    title,
    productImage,
    price,
    shortDescription,
    description,
    productUrl,
    category,
    tags,
    createdBy: req.user.id, // Assuming req.user is populated with the authenticated user's info
  });

  if (!newProject) {
    return next(new AppError("Project creation failed", 500));
  }

  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

const getAllProjects = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const projects = await project.findAll({
    where: { createdBy: userId },
    include: user, // user refers to the model name
    attributes: { exclude: ["deletedAt"] },
    order: [["createdAt", "DESC"]],
  });

  if (!projects) {
    return next(new AppError("No projects found", 404));
  }

  res.status(200).json({
    status: "success",
    data: projects,
  });
});

const getProjectById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const projectData = await project.findByPk(id, {
    include: user,
  });

  if (!projectData) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: projectData,
  });
});

const updateProject = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  const projectData = await project.findOne({ where: { id, createdBy: userId } });

  if (!projectData) {
    return next(new AppError("Project not found", 404));
  }

  const updateFields = [
    "title",
    "productImage",
    "price",
    "shortDescription",
    "description",
    "productUrl",
    "category",
    "tags",
  ];

  const updates = {};

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedProject = await projectData.update(updates);

  res.status(200).json({
    status: "success",
    data: updatedProject,
  });
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  const projectData = await project.findOne({ where: { id, createdBy: userId }});

  if (!projectData) {
    return next(new AppError("Project not found", 404));
  }

  await projectData.destroy();

  res.status(204).json({
    status: "success",
    mesage: "Project deleted successfully",
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
