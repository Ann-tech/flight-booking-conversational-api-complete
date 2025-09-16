const { Flight, Booking } = require('../models/db.connect');
const { Op, Sequelize } = require('sequelize');

async function handleBookingStatus(parameters, userId) {
    if (!userId) {
        return {
            message: "Please log in to check your booking status.",
            type: 'text'
        };
    }

    const { bookingId } = parameters.fields;
    let whereClause = { userId };

    if (bookingId?.stringValue) {
        whereClause.id = parseInt(bookingId.stringValue);
    }

    const bookings = await Booking.findAll({
        where: whereClause,
        include: [{
            model: Flight,
            attributes: ['flightName', 'departureCity', 'arrivalCity', 'departureTime']
        }],
        order: [['bookingDate', 'DESC']],
        limit: bookingId ? 1 : 5
    });

    if (bookings.length === 0) {
        const message = bookingId?.stringValue ?
            `I couldn't find booking #${bookingId.stringValue}. Please check the booking ID.` :
            "You don't have any bookings yet. Would you like to book a flight?";

        return {
            message,
            type: 'text'
        };
    }

    const bookingMessages = bookings.map(booking => {
        const flight = booking.Flight;
        const statusText = {
            'confirmed': 'CONFIRMED',
            'pending': 'PENDING',
            'canceled': 'CANCELLED'
        }[booking.status];

        return (
            `Booking #${booking.id} - ${statusText}\n` +
            `Flight: ${flight.flightName}\n` +
            `Route: ${flight.departureCity} to ${flight.arrivalCity}\n` +
            `Departure: ${flight.departureTime.toLocaleString()}\n` +
            `Passengers: ${booking.passengerCount}\n` +
            `Total: $${booking.totalPrice}`
        );
    }).join('\n\n');

    return {
        message: `Here are your booking${bookings.length > 1 ? 's' : ''}:\n\n${bookingMessages}`,
        type: 'text',
        data: bookings
    };
}

async function handleMakeBooking(parameters, userId) {
    const { flightNumber, passengerCount } = parameters.fields;

    if (!flightNumber?.numberValue) {
        return {
            message: "Please specify which flight you'd like to book. For example, 'Book flight AA123 for 2 passengers'",
            type: 'text'
        };
    }

    const flightIdentifier = flightNumber.numberValue;
    const passengers = passengerCount?.numberValue || 1;

    const flight = await Flight.findOne({
        where: {
            [Op.or]: [
                {
                    flightName: {
                        [Op.like]: `%${flightIdentifier}%`
                    }
                },
                {
                    id: isNaN(flightIdentifier) ? null : parseInt(flightIdentifier)
                }
            ]
        }
    });

    if (!flight) {
        return {
            message: `Sorry, I couldn't find flight "${flightIdentifier}". Please check the flight number.`,
            type: 'text'
        };
    }

    if (flight.availableSeats < passengers) {
        return {
            message: `Only ${flight.availableSeats} seat${flight.availableSeats !== 1 ? 's' : ''} available on ${flight.flightName}. Please choose a different flight or fewer passengers.`,
            type: 'text'
        };
    }

    try {
        const booking = await Booking.create({
            userId: userId,
            flightId: flight.id,
            passengerCount: passengers,
            totalPrice: flight.ticketPrice * passengers,
            status: 'confirmed'
        });

        await Flight.update(
            { availableSeats: flight.availableSeats - passengers },
            { where: { id: flight.id } }
        );

        const message =
            `Booking confirmed!\n\n` +
            `Booking #: ${booking.id}\n` +
            `Flight: ${flight.flightName}\n` +
            `Route: ${flight.departureCity} to ${flight.arrivalCity}\n` +
            `Departure: ${flight.departureTime.toLocaleString()}\n` +
            `Passengers: ${passengers}\n` +
            `Total: $${booking.totalPrice}\n` +
            `Status: ${booking.status}`;

        return {
            message,
            type: 'text',
            data: booking
        };

    } catch (error) {
        console.error('Booking creation error:', error);
        return {
            message: "Sorry, I encountered an error while processing your booking. Please try again.",
            type: 'text'
        };
    }
}

module.exports = {
    handleBookingStatus,
    handleMakeBooking
}