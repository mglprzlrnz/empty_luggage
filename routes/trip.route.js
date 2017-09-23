const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips.controller');

router.get('/', tripsController.getAll);


module.exports = router;