const express = require('express');
const router = express.Router();
const logoutController = require('')

router.post('/logout', logoutController.handleLogout);

module.exports = router;
