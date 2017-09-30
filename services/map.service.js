const request = require('request');




module.exports.getCoordinates = (req, res, next) => {
    const city = '/api'
    const MAPS_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=madrid%20+%20spain%20&key=AIzaSyCHx5V79TEhiohWU6mZzT_2MuDvnDT7IQg"
    request.get(MAPS_URL, (err, gres, gbody) => {
        res.status(200).json(JSON.perse(gbody));
    })
};