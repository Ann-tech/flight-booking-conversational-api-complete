const isDevelopment = process.env.NODE_ENV === 'development';

class ApiError extends Error {

    /**
   * ApiError Constructor:
   * Creates an instance of the ApiError class, extending the base Error class.
   *
   * @constructor
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {string} message - The error message to be displayed.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational or a programming error.
   * @param {string} [stack=''] - Optional stack trace, included only in development mode.
   */

    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack && isDevelopment) {
            this.stack = stack;
        }
    }

}

module.exports = ApiError;
