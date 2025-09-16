const https = require('https');
const { Booking } = require('../models/db.connect');
const { Flight } = require('../models/db.connect');
const { getAllBookings, getBookedFlight, bookFlight, updateBookingStatus } = require('../services/booking.service');

//TODO - move payment config to payment helper
const paystackConfig = require('../config/paystackConfig');

async function httpGetAllBookings(req, res, next) {
    try {
        const bookings = await getAllBookings({ userId: req.user.id });

        res.status(200).json({success: true, bookings })
    } catch(err) {
        next(err);
    }
}

async function httpGetBookedFlight(req, res, next) {
    try {
        const booking = await getBookedFlight({ id: req.params.id, userId: req.user.id });

        res.status(200).json({success: true, booking})
    } catch(err) {
        next(err);
    }
}

//TODO - return checkout url after booking
async function httpBookFlight(req, res, next) {
    try {
        await bookFlight({ userId: req.user.id, flightId: req.body.flightId });

        res.status(201).json({success: true, message: 'flight successfully booked, kindly make payment to confirm'});
    } catch(err) {
        next(err);
    }
}

async function httpUpdateBookingStatus(req, res, next) {
    try {
        await updateBookingStatus({ id: req.params.id, userId: req.user.id, status: req.body.status });

        res.status(200).json({success: true, message: `booking status successfully updated ${status}`})
    } catch(err) {
        next(err);
    }
}

//TODO - update payment status after confirmation via webhook
async function httpMakePaymentById(req, res, next) {
    const id = req.params.id;
    const userId = req.user.id;
    const email = req.user.email;

    const booking = await Booking.findOne({
        where: {
            id,
            userId
        }
    });

    if (!booking) return res.status(404).json( {success: false, message: "Booking with such id doesn't exits"});

    const paymentInfo = {
        email,
        amount: booking.totalPrice
    }
      
    const request = https.request(paystackConfig, response => {
        let data = ''
        
        response.on('data', (chunk) => {
            data += chunk
        });
        
        response.on('end', async () => {
            try {
                let obj = JSON.parse(data);
                await Booking.update({ status: "confirmed" }, {
                    where: {
                        id,
                        userId
                    }
                });
                return res.status(200).json({success: true, message: "Payment successful", confirmationUrl: obj.data.authorization_url});
            } catch(err) {
                next(err);
            }
        })

        response.on('error', error => {
            console.error(error)
        })
    })
    
    request.write( JSON.stringify(paymentInfo) );
    request.end()     
}

module.exports = {
    httpGetAllBookings,
    httpGetBookedFlight,
    httpBookFlight,
    httpUpdateBookingStatus,
    httpMakePaymentById
}