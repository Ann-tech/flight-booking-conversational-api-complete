const { runSample } = require('../helpers/chatbot_helper');
const { Flight } = require('../models/db.connect');

async function httpSendMessage(req, res, next) {
    try {
        const { message } = req.body;
        if (!message) res.send(400).json({message: "provide a message"});
        const data = await runSample(process.env.PROJECT_ID, message);
        if (data.action === 'input.welcome') {
            return res.status(200).json({message: data.fulfillmentText});
        } else if (data.action === "getAvailableFlights") {
            const flights = await Flight.findAll();
            return res.status(200).json({success: true, message: "Here is a list of all flights", flights });
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    httpSendMessage
}