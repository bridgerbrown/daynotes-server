const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.handleUserData);

module.exports = router;
