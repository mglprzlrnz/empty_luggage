const express = require('express');
const User = require('../models/user.model');
const passport = require('passport');
const _ = require('lodash');
const Trip = require('../models/trip.model');
const request = require ('request')




module.exports.register = (req, res, next) => {
    
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name:req.body.name,
        surname: req.body.surname
    });

    if (!user.email || !user.password || !user.name || !user.surname) {
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
    User.findById(req.user._id)
        .then( user => {
            if (!user) {
                res.status(404).json({ message: 'me da el error aqui' });
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
    const gCityFrom = req.body.from.city;
    const gCountryFrom = req.body.from.country;
    const gCityTo = req.body.to.city;
    const gCountryTo = req.body.to.country;
    const MAPS_URL_FROM = `https://maps.googleapis.com/maps/api/geocode/json?address=${gCityFrom}%20+%20${gCountryFrom}%20&key=AIzaSyCHx5V79TEhiohWU6mZzT_2MuDvnDT7IQg`
    const MAPS_URL_TO = `https://maps.googleapis.com/maps/api/geocode/json?address=${gCityTo}%20+%20${gCountryTo}%20&key=AIzaSyCHx5V79TEhiohWU6mZzT_2MuDvnDT7IQg`
    request.get(MAPS_URL_FROM, (fromerr, fromres, frombody) => {
        let dataFrom = JSON.parse(frombody);
        if (dataFrom.status === "ZERO_RESULTS") {
            return res.status(404).json({message: "Departure location is not valid"}); 
        } else {
            request.get(MAPS_URL_TO, (toerr, tores, tobody) => {
                let dataTo = JSON.parse(tobody);
                if (dataTo.status == "ZERO_RESULTS") {
                    return res.status(404).json({message: "Arrival location is not valid"}); 
                } else {
                    trip.from.lat = dataFrom.results[0].geometry.location.lat
                    trip.from.lng = dataFrom.results[0].geometry.location.lng
                    trip.to.lat = dataTo.results[0].geometry.location.lat
                    trip.to.lng = dataTo.results[0].geometry.location.lng
                    Trip.create(trip)
                        .then((t) => res.json(t))
                        .catch(err => next(err))
            
                    };
                });
        };
         
    });
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
                res.status(404).json();
            } else {
                trip.bag.restrictions = req.body.bag.restrictions;
                _.merge(trip, req.body);
                trip.save()
                    .then(trip => res.status(200).json(trip))
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}