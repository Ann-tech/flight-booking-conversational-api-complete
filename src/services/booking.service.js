const httpStatus = require('http-status');
const { Flight, Booking } = require('../models/db.connect');
const catchErrorHandler = require('../utils/errorHandler');
const ApiError = require('../utils/ApiError');

async function getAllBookings({ userId }) {
    try {
        const bookings = await Booking.findAll({
            where: {
                userId
            }
        });
        return bookings;
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function getBookedFlight({ userId, id }) {
    try {
        const booking = await Booking.findOne({
            where: {
                id,
                userId
            }
        });

        if (!booking) throw new ApiError(httpStatus.status.NOT_FOUND, `Booking with such id doesn't exits`);

        return booking;
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function bookFlight({ userId, flightId }) {
    try {
        const flight = await Flight.findByPk(flightId);
        if (!flight) throw new ApiError(httpStatus.status.NOT_FOUND, `flight with such id doesn't exist`);

        const totalPrice = flight.ticketPrice * req.body.passengerCount;
        return await Booking.create({...req.body, userId, totalPrice});
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

async function updateBookingStatus({ userId, id, status }) {
    try {
        const { status } = req.body;

        if (status === 'confirmed') throw new ApiError(httpStatus.status.NOT_FOUND, `Cannot update status until payment is made`);

        return await Booking.update({ status }, {
            where: {
                id,
                userId
            }
        });
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

module.exports = {
    getAllBookings,
    getBookedFlight,
    bookFlight,
    updateBookingStatus
}