const { Flight } = require('../models/db.connect');
const { Op, Sequelize } = require('sequelize');

async function handleAvailableFlights(parameters) {
    const { departureCity, arrivalCity, date } = parameters.fields;

    let whereClause = {};

    if (departureCity?.stringValue) {
        whereClause.departureCity = {
            [Op.like]: `%${departureCity.stringValue}%`
        };
    }

    if (arrivalCity?.stringValue) {
        whereClause.arrivalCity = {
            [Op.like]: `%${arrivalCity.stringValue}%`
        };
    }

    if (date?.stringValue) {
        const searchDate = new Date(date.stringValue);
        whereClause.departureTime = {
            [Op.between]: [
                new Date(searchDate.setHours(0, 0, 0, 0)),
                new Date(searchDate.setHours(23, 59, 59, 999))
            ]
        };
    }

    const flights = await Flight.findAll({
        where: whereClause,
        attributes: ['id', 'flightName', 'departureCity', 'arrivalCity',
            'departureTime', 'arrivalTime', 'availableSeats', 'ticketPrice']
    });

    if (flights.length === 0) {
        return {
            message: "Sorry, I couldn't find any flights matching your criteria.",
            type: 'text'
        };
    }

    const flightMessages = flights.map(flight =>
        `${flight.flightName}: ${flight.departureCity} to ${flight.arrivalCity}, ` +
        `Departure: ${flight.departureTime.toLocaleString()}, ` +
        `Seats: ${flight.availableSeats}, ` +
        `Price: $${flight.ticketPrice}`
    ).join('\n');

    return {
        message: `I found ${flights.length} flight${flights.length !== 1 ? 's' : ''}:\n${flightMessages}`,
        type: 'text',
        data: flights
    };
}

async function handleFlightDetails(parameters) {
    const { flightNumber } = parameters.fields;

    if (!flightNumber?.stringValue) {
        return {
            message: "Please specify which flight you'd like details for. For example, 'Tell me about flight AA123'",
            type: 'text'
        };
    }

    const flightIdentifier = flightNumber.stringValue;

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
            message: `Sorry, I couldn't find flight "${flightIdentifier}". Please check the flight number and try again.`,
            type: 'text'
        };
    }

    const message =
        `Flight: ${flight.flightName}\n` +
        `Route: ${flight.departureCity} to ${flight.arrivalCity}\n` +
        `Departure: ${flight.departureTime.toLocaleString()}\n` +
        `Arrival: ${flight.arrivalTime.toLocaleString()}\n` +
        `Available seats: ${flight.availableSeats}\n` +
        `Price: $${flight.ticketPrice}\n\n` +
        `Would you like to book this flight?`;

    return {
        message,
        type: 'text',
        data: flight
    };
}

module.exports = {
    handleAvailableFlights,
    handleFlightDetails
}