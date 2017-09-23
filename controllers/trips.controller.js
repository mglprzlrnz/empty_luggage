const express = require('express');
const Trip = require('../models/trip.model');

module.exports.getAll = (req, res, next) => {
    Trip.find()
        .then(trips => res.status(200).json(trips))
        .catch(err => next(err));
}

