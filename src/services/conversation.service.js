const httpStatus = require('http-status');
const { runSample, handleIntent } = require('../utils/dialogflow');
const catchErrorHandler = require('../utils/errorHandler');
const ApiError = require('../utils/ApiError');

async function sendMessage({ payload }) {
    try {
        const { message, userId } = payload;
        if (!message) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, `Please provide a message`);
        }

        const data = await runSample(process.env.PROJECT_ID, message);
        let response = await handleIntent(data, userId);
        return response;
    } catch (err) {
        catchErrorHandler({ error: err, message: err.message });
    }
}

module.exports = {
    sendMessage
}