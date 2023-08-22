const https = require('https');

const { Booking } = require('../models/db.connect');
const { Flight } = require('../models/db.connect');

const paystackConfig = require('../config/paystackConfig');

async function httpGetAllBookings(req, res, next) {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({
            where: {
                userId
            }
        });
        res.status(200).json({success: true, bookings })
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpGetBookedFlight(req, res, next) {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const booking = await Booking.findOne({
            where: {
                id,
                userId
            }
        });

        if (!booking) return res.status(404).json( {success: false, message: "Booking with such id doesn't exits"})

        res.status(200).json({success: true, booking})
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpBookFlight(req, res, next) {
    try {
        const userId = req.user.id;
        const flightId = req.body.flightId;

        const flight = await Flight.findByPk(flightId);
        if (!flight) return res.status(404).json({success: false, message: "flight with such id doesn't exist"})

        const totalPrice = flight.ticketPrice * req.body.passengerCount;
        const booking = await Booking.create({...req.body, userId, totalPrice});

        res.status(201).json({success: true, message: 'flight successfully booked, kindly make payment to confirm'});
    } catch(err) {
        console.log(err);
        next(err);
    }
}

async function httpUpdateBookingStatus(req, res, next) {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const { status } = req.body;

        if (status === 'confirmed') return res.status(400).json({status: false, message: "Cannot update status until payment is made"});

        const booking = await Booking.update({ status }, {
            where: {
                id,
                userId
            }
        });

        res.status(200).json({success: true, message: `booking status successfully updated ${status}`})
    } catch(err) {
        console.log(err);
        next(err);
    }
}

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