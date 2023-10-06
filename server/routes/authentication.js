const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

//these don't require authentication
router.route('/register')
    .post(usersController.createUser)
router.route('/login')
    .post(usersController.loginUser)
router.route('/logout')
    .get(usersController.logoutUser)
module.exports = router