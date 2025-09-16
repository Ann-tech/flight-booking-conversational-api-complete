const httpStatus = require('http-status');
const { Flight } = require('../models/db.connect');
const formatFlightData = require('../utils/formatFlightData')
const catchErrorHandler = require('../utils/errorHandler');
const ApiError = require('../utils/ApiError');

async function getAllFlights() {
    try {
        const flights = await Flight.findAll();
        return flights
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function getFlightById({ id }) {
    try {
        const id = req.params.id;
        const flight = await Flight.findByPk(id);

        if (!flight) throw new ApiError(httpStatus.status.NOT_FOUND, `flight with such id doesn't exits`);
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function createNewFlight({ payload }) {
    try {
        const flightData = formatFlightData(payload);
        const flight = await Flight.create(flightData);
        return flight;
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function updateFlightDetailsById({ payload }) {
    try {
        const { id, data } = payload;
        
        const flightData = formatFlightData(data);
        
        return await Flight.update({ ...flightData }, {
            where: {
                id,
            }
        });
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function deleteFlightById({ id }) {
    try {
        const flight = await Flight.findByPk(id);

        if (!flight) throw new ApiError(httpStatus.status.NOT_FOUND, `flight with such id doesn't exits`);
        
        await flight.destroy();
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

module.exports = {
    getAllFlights,
    getFlightById,
    createNewFlight,
    updateFlightDetailsById,
    deleteFlightById
}