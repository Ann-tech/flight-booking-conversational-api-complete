const express = require('express');
const conversationRoute = express.Router();

const { httpSendMessage } = require('../controllers/conversations.controller')

conversationRoute.post('/', httpSendMessage);

module.exports = conversationRoute;