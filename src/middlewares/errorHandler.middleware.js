const logger = require('../logging/logger')

// const handleDuplicateKeyError = (err, res) => {
//     const field = Object.keys(err.keyValue);
//     const code = 409;
//     const error = `${field} already exists`;
//     res.status(code).json({
//         success: false,
//         fields: field.join(", "),
//         message: error
//     });
// }

const handleValidationError = (err, res) => {
    console.group(err.errors);
    let errors = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;

    let formattedErrors;
    let formattedFields;

    if (errors.length == 1) {
        formattedErrors = errors.join(' ');
        formattedFields = fields.join(', ');
        return res.status(code).json({success: false, message: formattedErrors, field: formattedFields});
    }

    return res.status(code).json({success: false, messages: errors, fields: fields});
}

async function errorHandler(err, req, res, next) {
    console.log(err);
    logger.error("An error has occured")
    logger.error(err.message)
    try {
        if(err.name === 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError') return handleValidationError(err, res);

        if (err.message == "email or password is incorrect") return res.status(400).json({success: false, message: err.message})
        throw err;
    } catch(err) {
        res.status(500).json({success: false, message: 'An unknown error occurred.'});
    }
}

module.exports = errorHandler;