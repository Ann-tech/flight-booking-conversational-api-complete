const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const { handleAvailableFlights, handleFlightDetails } = require('../helpers/flight.helper');
const { handleBookingStatus, handleMakeBooking } = require('../helpers/booking.helper');
require("dotenv").config();

const { PROJECT_ID } = process.env;

async function runSample(projectId = PROJECT_ID, message, sessionId = null) {
    const sessionClient = new dialogflow.SessionsClient();

    // Use provided sessionId or generate new one
    const actualSessionId = sessionId || uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, actualSessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US',
            },
        },
        queryParams: {
            payload: {
                fields: {
                    source: {
                        stringValue: "web_chat"
                    }
                }
            }
        }
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;

        return {
            action: result.action,
            parameters: result.parameters,
            fulfillmentText: result.fulfillmentText,
            intent: result.intent?.displayName,
            confidence: result.intentDetectionConfidence,
            sessionId: actualSessionId,
            allRequiredParamsPresent: result.allRequiredParamsPresent
        };

    } catch (err) {
        console.error('Dialogflow Error:', err);
        throw err;
    }
}

async function handleIntent(data, userId) {
    try {
        const { action, parameters, fulfillmentText } = data;
        // console.log(JSON.stringify(data, null, 2))

        switch (action) {
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
    } catch (err) {
        throw err;
    }
}


module.exports = {
    runSample,
    handleIntent
};