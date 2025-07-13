const router = require("express").Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { verifyJWT, restrictTo } = require("../middlewares/verifyJWT");

// Route for creating a new project
router
  .route("/")
  .post(verifyJWT, restrictTo("1"), createProject)
  .get(verifyJWT, getAllProjects);

router
  .route("/:id")
  .get(verifyJWT, getProjectById)
  .patch(verifyJWT, updateProject)
  .delete(verifyJWT, deleteProject);

// Export the router
module.exports = router;
