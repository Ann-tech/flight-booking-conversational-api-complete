const request = require('supertest');
const app = require('../src/index');

describe('Test flights routes', () => {
    const flights = require('./fixtures/flights.json');
    const users = require('./fixtures/users.json');
    let loginAsAdmin = users[5];

    beforeEach(async () => {
        const response = await request(app).post('/api/v1/auth/login')
                .send(loginAsAdmin)
        ({ token } = response.body);
    })

    it('should return 201 created for successfully scheduled flights', async () => {
        let flightWithCompleteData = flights[0];

        const response = await request(app).post('/api/v1/flights')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(flightWithCompleteData)
                .expect(201)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("flight successfully scheduled");                  
    });

    it('should return 201 created for successfully scheduled flights', async () => {
        let flightWithCompleteData = flights[2];

        const response = await request(app).post('/api/v1/flights')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(flightWithCompleteData)
                .expect(201)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("flight successfully scheduled");                  
    });

    it('should return 400 error if flightName is missing', async () => {
        let flightWithoutCompleteData = flights[2];

        const response = await request(app).post('/api/v1/flights')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(flightWithoutCompleteData)
                .expect(400)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("provide required fields");                  
    });

    it('should return 200 success for successfully updated flights', async () => {
        let updatedFlightData = flights[1];

        const response = await request(app).patch('/api/v1/flights/1')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(updatedFlightData)
                .expect(200)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("flight successfully updated");                  
    });
    
    it('should return 200 success to get all flights', async () => {
        const response = await request(app).get('/api/v1/flights')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .expect(200)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.flights.length).toBe(2);                  
    });

    it('should return 200 success when a flight is successfully deleted', async () => {
        const response = await request(app).delete('/api/v1/flights/1')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .expect(200)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Flight successfully deleted");                  
    });

})