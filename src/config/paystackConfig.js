require('dotenv').config();

const paystackConfig = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: process.env.PAYSTACK_KEY,
      'Content-Type': 'application/json'
    }
}

module.exports = paystackConfig;