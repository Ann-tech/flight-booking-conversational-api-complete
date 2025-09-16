const { sendMessage } = require('../services/conversation.service');

async function httpSendMessage(req, res, next) {
  try {
    const payload = { message: req.body.message, userId: req.user?.id };
    const response = await sendMessage({ payload });
    
    res.status(200).json(response); 
  } catch(err) {
    next(err);
  }
}

module.exports = { httpSendMessage };