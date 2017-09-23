const express = require('express');
const router = express.Router();
const passportConfig = require('../configs/passport.config');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/logout', passportConfig.isAuthenticated, authController.logout);

module.exports = router;