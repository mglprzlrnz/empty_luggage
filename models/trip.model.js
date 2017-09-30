const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        required: 'Trip needs an owner'
    },
    from: {
        city: {
            type: String,
            required: 'The departure City is required'
        },
        country: {
            type: String,
            required: 'The departure Country is required'
        },
        lat: Number,
        lng: Number
    },
    to: {
        city: {
            type: String,
            required: 'The destitaion City is required'
        },
        country: {
            type: String,
            required: 'The destiantion Country is required'
        },
        lat: Number,
        lng: Number
    },
    departureDateTime: {
        type: Date,
        required: 'The departure date is required'
    },
    arrivalDateTime: {
        type: Date,
        required: 'The arrival date is required'
    },
    bag: {
        restrictions: {
            type: [String], 
        },
        weight: {
            type: Number,
            required: 'Available weight is required'
        },
        dimensions: {
            high: {
                type: Number,
                required: 'Dimensions availability is required'
            },
            width: {
                type: Number,
                required: 'Dimensions availability is required'
            }   
        }  

    }

}, {timestamps: true});


const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;