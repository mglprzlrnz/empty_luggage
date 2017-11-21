const express = require('express');
const Trip = require('../models/trip.model');
const MAX_RECENT_TRIPS = 10;

module.exports.getAll = (req, res, next) => {
    const query = {};
    if (req.query.fromCity) {
        query['from.city'] = req.query.fromCity;
    }
    if (req.query.toCity) {
        query['to.city'] = req.query.toCity;
    }
    if (req.query.fromCountry) {
        query['from.country'] = req.query.fromCountry;
    }
    if (req.query.toCountry) {
        query['to.country'] = req.query.toCountry;
    }
    if (req.query.weight) {
        query['bag.weight'] = { $gte : req.query.weight };
    }
    if (req.query.departureDateTime) {
        query.departureDateTime = { $gte : new Date(req.query.departureDateTime) };
    }
    if (req.query.arrivalDateTime) {
        query.arrivalDateTime = { $gte : new Date(req.query.arrivalDateTime) };
    }

    Trip.find(query)
        .then(trips => res.status(200).json(trips))
        .catch(err => next(err));
}

module.exports.getRecents = (req, res, next) => {
    Trip.find()
        .sort({ departureDateTime: -1})
        .limit(MAX_RECENT_TRIPS)
        .then(trips => res.status(200).json(trips))
        .catch(err => next(err));
}

module.exports.getTrip = (req, res, next) => {
    Trip.findById(req.params.id)
        .populate('owner')
    .then(trip => res.status(200).json(trip))
    .catch(err => next(err));
}


