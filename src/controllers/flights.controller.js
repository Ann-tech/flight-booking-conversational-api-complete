const { getAllFlights, getFlightById, createNewFlight, deleteFlightById } = require('../services/flight.service');

async function httpGetAllFlights(req, res, next) {
    try {
        const flights = await getAllFlights();
        return res.status(200).json({success: true, flights })
    } catch(err) {
        next(err);
    }
}

async function httpGetFlightById(req, res, next) {
    try {
        const flight = await getFlightById({ id: req.params.id });

        res.status(200).json({success: true, flight})
    } catch(err) {
        next(err);
    }
}

async function httpCreateNewFlight(req, res, next) {
    try {
        const flight = await createNewFlight({ payload: req.body });

        res.status(201).json({success: true, message: 'flight successfully scheduled'});
    } catch(err) {
        next(err);
    }
}

async function httpUpdateFlightDetailsById(req, res, next) {
    try {
        const payload = { id: req.params.id, data: req.body };
        
        await updateFlightDetailsById({ payload });
        
        res.status(200).json({success: true, message: 'flight successfully updated'})
    } catch(err) {
        next(err);
    }
}

async function httpDeleteFlightById(req, res, next) {
    try {
        await deleteFlightById({ id: req.params.id });

        res.status(200).json({success: true, message: 'flight successfully deleted'})
    } catch(err) {
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