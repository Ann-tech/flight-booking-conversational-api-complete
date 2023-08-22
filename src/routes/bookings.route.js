const express = require('express');
const BookingRouter = express.Router();

const { 
    httpGetAllBookings, 
    httpGetBookedFlight, 
    httpBookFlight,
    httpUpdateBookingStatus,
    httpMakePaymentById
} = require('../controllers/bookings.controllers');


BookingRouter.get('/', httpGetAllBookings);
BookingRouter.get('/:id', httpGetBookedFlight);
BookingRouter.post('/', httpBookFlight);
BookingRouter.patch('/:id', httpUpdateBookingStatus);
BookingRouter.get('/pay/:id', httpMakePaymentById)


module.exports = BookingRouter;