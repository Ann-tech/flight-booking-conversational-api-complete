const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
require("dotenv").config();

const { PROJECT_ID } = process.env;
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = PROJECT_ID, message) {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
  
    const result = responses[0].queryResult;
  
    return responses[0].queryResult;
}

module.exports = {
  runSample
}