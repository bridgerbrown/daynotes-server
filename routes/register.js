const express = require('express');
const router = express.Router();
const registerController = require('')

router.post('/register', registerController.handlNewUser);

module.exports = router;
