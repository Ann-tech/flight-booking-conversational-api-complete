const { Flight } = require('../models/db.connect');
const formatFlightData = require('../utils/formatFlightData')

async function httpGetAllFlights(req, res, next) {
    try {
        const flights = await Flight.findAll();
        return res.status(200).json({success: true, flights })
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpGetFlightById(req, res, next) {
    try {
        const id = req.params.id;
        const flight = await Flight.findByPk(id);

        if (!flight) return res.status(404).json( {success: false, message: "flight with such id doesn't exits"})

        res.status(200).json({success: true, flight})
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpCreateNewFlight(req, res, next) {
    try {
        const flightData = formatFlightData(req.body);
        const flight = await Flight.create(flightData);
        res.status(201).json({success: true, message: 'flight successfully scheduled'});
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpUpdateFlightDetailsById(req, res, next) {
    try {
        const id = req.params.id;
        const flightData = formatFlightData(req.body);
        
        const flight = await Flight.update({ ...flightData }, {
            where: {
                id,
            }
        })
        res.status(200).json({success: true, message: 'flight successfully updated'})
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpDeleteFlightById(req, res, next) {
    try {
        const id = req.params.id;
        const flight = await Flight.findByPk(id);

        if (!flight) return res.status(404).json( {success: false, message: "flight with such id doesn't exits"}); 
        
        await flight.destroy();
        res.status(200).json({success: true, message: 'flight successfully deleted'})
    } catch(err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    httpGetAllFlights,
    httpGetFlightById,
    httpCreateNewFlight,
    httpUpdateFlightDetailsById,
    httpDeleteFlightById
}