const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips.controller');

router.get('/', tripsController.getAll);
router.get('/recents', tripsController.getRecents);
router.get('/:id', tripsController.getTrip);

module.exports = router;