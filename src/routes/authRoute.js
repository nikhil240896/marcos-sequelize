const router = require('express').Router();
const { signup, login } = require('../controllers/authController');

// Route for user signup
router.route('/signup').post(signup);
router.route('/login').post(login);

// Export the router
module.exports = router;