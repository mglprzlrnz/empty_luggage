const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        required: 'Trip needs an owner'
    },
    from: {
        type: String,
        required: 'This field is required'
    },
    to: {
        type: String,
        required: 'The destination is required'
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