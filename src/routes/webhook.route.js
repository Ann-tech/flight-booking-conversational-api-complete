const express = require('express');
const webhookRoute = express.Router();


webhookRoute.post('/', (req, res) => {
    res.status(201).json({message: "Processing request"});
});

module.exports = webhookRoute;