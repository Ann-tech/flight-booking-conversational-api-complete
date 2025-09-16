const httpStatus = require('http-status');
const ApiError = require('./ApiError');

/**
 * Error Handler Function:
 * Handles and logs errors, optionally tracing the error stack for debugging purposes.
 * 
 * @param {object} options - The options object containing error details and configuration.
 * @param {Record<string, any>} options.error - The error object to be handled.
 * @param {string} options.message - A custom error message.
 * @param {boolean} [options.trace=false] - Flag to indicate if the stack trace should be logged. Defaults to `false`.
 * @throws {ApiError} - Throws an API error with the provided message and status code.
 */

const catchErrorHandler = ({ error, message, trace = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? true : false }) => {
    if (trace) {
        console.trace(error);
    }

    throw new ApiError(error?.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error?.message || message);
};

module.exports = catchErrorHandler; 