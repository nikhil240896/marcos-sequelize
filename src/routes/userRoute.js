const { getAllUsers } = require('../controllers/userController');
const { verifyJWT, restrictTo } = require('../middlewares/verifyJWT');

const router = require('express').Router();

router.route('/').get(verifyJWT, restrictTo('0'), getAllUsers);

module.exports = router;