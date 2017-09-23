const express = require('express');
const router = express.Router();
const passportConfig = require('../configs/passport.config');
const userController = require('../controllers/user.controller');


router.post('/', userController.register);
router.put('/', passportConfig.isAuthenticated, userController.edit);
router.post('/trips', passportConfig.isAuthenticated, userController.createTrip);
router.get('/trips', passportConfig.isAuthenticated, userController.getTrips);
router.get('/trips/:id', passportConfig.isAuthenticated, userController.getTrip);
router.put('/trips/:id', passportConfig.isAuthenticated, userController.editTrip);

module.exports = router;