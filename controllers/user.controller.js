const express = require('express');
const User = require('../models/user.model');
const passport = require('passport');
const _ = require('lodash');
const Trip = require('../models/trip.model');

module.exports.register = (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name:req.body.name,
        surname: req.body.surname,
        trips: []
    });

    if (!user.email || !user.password || !user.name || !user.surname) {
        console.log(user)
        return res.status(400).json({ message: 'All the fields are required' });
    } else {
        User.findOne({email: user.email}, (err, exist) => {
            if (err) { return next(err) }
            else if (exist) {
                return res.status(400).json({ message: 'This email account is already in registered' });
            } else {
                user.save((err) => {
                    if (err) { return next(err) }
                    else {
                        req.login(user, (err) => {
                            if (err) { return next(err) }
                            else {
                                return res.status(200).json(req.user);
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports.edit = (req, res, next) => {
    User.findById(req.params.id)
        .then( user => {
            if (!user) {
                res.status(404).json();
            } else {
                _.merge(user, req.body);
                user.save()
                    .then(user => res.status(200).json(user))
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}

module.exports.createTrip = (req, res, next) => {
    const trip = req.body;
    trip.owner = req.user._id;
    Trip.create(trip)
        .then((t) => res.json(t))
        .catch(err => next(err))
};

module.exports.getTrips = (req, res, next) => {
    Trip.find({"owner": req.user._id})
        .then(trips => res.status(200).json(trips))
        .catch(err => next(err));
}

module.exports.getTrip = (req, res, next) => {
    Trip.findById(req.params.id)
        .then(trip => res.status(200).json(trip))
        .catch(err => next(err));
}

module.exports.editTrip = (req, res, next) => {
    Trip.findById(req.params.id)
        .then( trip => {
            if (!trip) {
                res.status(404).json({ message: 'soy un capullo' });
            } else {
                _.merge(trip, req.body);
                trip.save()
                    .then(trip => res.status(200).json(trip))
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}