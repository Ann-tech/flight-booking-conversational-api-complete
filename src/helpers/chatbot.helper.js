const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
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
    
  } catch (error) {
    console.error('Dialogflow Error:', error);
    throw error;
  }
}

module.exports = { runSample };