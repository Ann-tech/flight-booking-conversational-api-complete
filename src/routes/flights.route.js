const express = require('express');
const FlightRouter = express.Router();

const authorizeUser = require('../middlewares/authorizeUser');

const { 
    httpGetAllFlights, 
    httpGetFlightById, 
    httpCreateNewFlight, 
    httpUpdateFlightDetailsById, 
    httpDeleteFlightById
} = require('../controllers/flights.controller');

FlightRouter.get('/', httpGetAllFlights);
FlightRouter.get('/:id', httpGetFlightById);

FlightRouter.use(authorizeUser)

FlightRouter.post('/', httpCreateNewFlight);
FlightRouter.put('/:id', httpUpdateFlightDetailsById);
FlightRouter.delete('/:id', httpDeleteFlightById);

module.exports = FlightRouter;