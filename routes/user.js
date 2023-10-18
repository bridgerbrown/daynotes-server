const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.handleUserData);
router.patch('/', userController.updateUserImage);

module.exports = router;
