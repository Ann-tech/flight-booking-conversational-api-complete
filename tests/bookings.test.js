const request = require('supertest');
const app = require('../src/index');

describe('Test bookings routes', () => {
    const bookings = require('./fixtures/bookings.json');
    const users = require('./fixtures/users.json');
    let user = users[2];

    beforeEach(async () => {
        const response = await request(app).post('/api/v1/auth/login')
                .send(user)
        ({ token } = response.body);
    })

    it('should return 201 created for successfully booked flights', async () => {
        let bookingDetails = bookings[0];

        const response = await request(app).post('/api/v1/bookings')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(bookingDetails)
                .expect(201)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("flight successfully booked");                  
    });

    it('should return 404 for unavailable flights', async () => {
        let bookingDetails = bookings[1];

        const response = await request(app).post('/api/v1/bookings')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .send(bookingDetails)
                .expect(404)
                .expect("Content-Type", /json/);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No flight is available at the moment for that destination");                  
    });

    

})