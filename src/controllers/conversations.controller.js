const { runSample } = require('../helpers/chatbot.helper');
const { Flight, Booking, User } = require('../models/db.connect');
const { Op, Sequelize } = require('sequelize');

async function httpSendMessage(req, res, next) {
  try {
    const { message } = req.body;
    const userId = req.user?.id;
    
    if (!message) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    const data = await runSample(process.env.PROJECT_ID, message);
    let response = await handleIntent(data, userId);
    
    res.status(200).json(response);
    
  } catch(err) {
    console.log(err);
    next(err);
  }
}

async function handleIntent(data, userId) {
  const { action, parameters, fulfillmentText } = data;
  console.log(JSON.stringify(data, null, 2))
  
  switch(action) {
    case 'input.welcome':
      return { 
        message: fulfillmentText,
        type: 'text'
      };

    case 'get_available_flights':
      return await handleAvailableFlights(parameters);

    case 'get_flight_details':
      return await handleFlightDetails(parameters);

    case 'check_booking_status':
      return await handleBookingStatus(parameters, userId);

    case 'make_booking':
      return await handleMakeBooking(parameters, userId);

    default:
      return {
        message: fulfillmentText || "I'm not sure how to help with that. Could you rephrase?",
        type: 'text'
      };
  }
}

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

module.exports = { httpSendMessage };