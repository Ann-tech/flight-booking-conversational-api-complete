# flight-booking-conversational-api
A Node.js-based conversational API that enables natural language interactions for flight booking systems using Dialogflow NLP integration.

## Features
- **Natural Language Processing**: Understands user queries in conversational language
- **Intent Detection**: Identifies user intentions (flight search, booking, status checks)
- **Database Integration**: Real-time flight and booking operations
- **Template-based Responses**: Dynamic, data-driven conversation responses
- **User Authentication**: Secure user context for personalized experiences

## Development

### Prerequisites

- [Node.js]
- [MySql]
- [Dialogflow]

#### Clone this repo

```sh
git clone https://github.com/Ann-tech/flight-booking-conversational-api.git
```

#### Install project dependencies

```sh
npm install
```

#### Update .env with 
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET

#### Run a development server

```sh
npm run dev
```


### Models

#### User

| field      | data_type     | constraints      |
| ---------  | ------------- | ---------------- |
| email      | string        | required, unique |
| password   | string        | required         |
| role       | ref - Role    |                  |

#### Role

| field      | data_type     | constraints      |
| ---------  | ------------- | ---------------- |
| name       | string        | Enum(admin, user)|


#### Flight

| field         | data_type  | constraints                                              |
| ------------  | ---------- | -------------------------------------------------------- |
| flightName    | string     | required                  |
| departureCity |string      | required                  |
| arrivalCity   |string      | required                  |
| departureTime |date        | required                  |
| arrivalTime   |date        | required                  |
| availableSeats|integer     | required                  |
| ticketPrice   |integer     | required                  |

#### Booking

| field         | data_type  | constraints                                              |
| ------------  | ---------- | -------------------------------------------------------- |
| userId        | integer    | required (foreign key)    |
| flightId      | integer    | required (foreign key)    |
| bookingDate   |date        | required                  |
| status        |string      | required enum(pending, confirmed, canceled)|
| passengerCount|integer     | required                  |
| totalPrice    |integer     | required                  |

<p align="right"><a href="#readme-top">back to top</a></p>

---

## Usage

### Base URL

- https://flight-booking-conversational-api.onrender.com

### Creating a user

- Route: /api/v1/auth/signup
- Method: POST

:point_down: Body

```json
{
    "name": "Ann",
    "email": "ann@gmail.com",
    "password": "abc"
}
```

:point_down: Response

```json
{
    "success": true,
    "message": "signup successful"
}
```

### Creating an admin

- Route: /api/v1/auth/signup
- Method: POST

:point_down: Body

```json
{
    "name": "Oscar",
    "email": "scar@gmail.com",
    "password": "dbi",
    "role": "admin"
}
```

:point_down: Response

```json
{
    "success": true,
    "message": "signup successful"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Logging in

- Route: /api/v1/auth/login
- Method: POST

:point_down: Body

```json
{
    "email": "ann@gmail.com",
    "password": "abc"
}
```

:point_down: Response

```json
{
    "message": "login successful"
    "token": {token}
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Create flights - Only admin can create flights

- Route: /api/v1/flights
- Method: POST
- Header
  - Authorization: Bearer {token}

:point_down: Body

```json
{
    "flightName": "Aero Contractors Flight 100",
    "departureCity": "Enugu",
    "arrivalCity": "Lagos",
    "departureTime": 1691779659956,
    "arrivalTime": 1691779659956,
    "availableSeats": 10,
    "ticketPrice": 50000
}
```

:point_down: Response

```json
{
    "success": true,
    "message": "flight successfully scheduled"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Get all scheduled flights - all authenticated users can get all scheduled flights

- Route: api/v1/flights
- Method: GET
- Header
- Authorization: Bearer {token}


:point_down: Response

```json
{
    "success": true,
    "flights": [
        {
            "id": 1,
            "flightName": "aero contractors flight 100",
            "departureCity": "enugu",
            "arrivalCity": "lagos",
            "departureTime": "2023-08-11T18:47:39.000Z",
            "arrivalTime": "2023-08-11T18:47:39.000Z",
            "availableSeats": 10,
            "ticketPrice": 50000,
            "createdAt": "2023-08-12T22:22:26.000Z",
            "updatedAt": "2023-08-12T22:22:26.000Z"
        }
    ]
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---


### Update flight by id - only admins can update flights

- Route: api/v1/flights/id
- Method: PUT
- Header
- Authorization: Bearer {token}
- paramater: id

:point_down: Body
route - api/v1/flights/1

```json
{
    "flightName": "Air peace",
    "departureCity": "Kaduna",
    "arrivalCity": "Lagos"
}

```

:point_down: Response

```json
{
    "success": true,
    "message": "flight successfully updated"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---


### Book a flight - all authenticated users can book flight
Booking details will be populated by the api based on flight booked

- Route: /api/v1/bookings
- Method: POST
- Header
  - Authorization: Bearer {token}

:point_down: Body

```json
{
    "flightId": 1,
    "passengerCount": 2
}
```

:point_down: Response

```json
{
    "success": true,
    "message": "flight successfully booked, kindly make payment to confirm"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Cancel a flight - all authenticated users can cancel flights
Booking details will be populated by the api based on flight booked

- Route: /api/v1/bookings
- Method: PATCH
- Header
  - Authorization: Bearer {token}

:point_down: Body

```json
{
  "status": "canceled"
}
```

:point_down: Response

```json
{
  "success": true,
  "message": "booking status successfully updated canceled"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Get all booked flights - all authenticated users can get all booked flights

- Route: api/v1/bookings
- Method: GET
- Header
- Authorization: Bearer {token}


:point_down: Response

```json
{
    "success": true,
    "bookings": [
        {
            "id": 1,
            "userId": 1,
            "flightId": 1,
            "bookingDate": "2023-08-12T22:39:07.000Z",
            "status": "pending",
            "passengerCount": 2,
            "totalPrice": 100000,
            "createdAt": "2023-08-12T22:39:07.000Z",
            "updatedAt": "2023-08-12T22:39:07.000Z"
        }
    ]
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Make payments - all authenticated users make payments to confirm booked flights based on id

- Route: api/v1/bookings/pay/id
- Method: GET
- Header
- Authorization: Bearer {token}
- parameter: id

:point_down: Request
- /api/v1/bookings/pay/1

:point_down: Response

```json
{
    "success": true,
    "message": "Payment successful",
    "confirmationUrl": "https://checkout.paystack.com/6pozi90kkvid02o"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---


### Send messages - authenticated users can send messages

- Route: api/v1/conversations
- Method: POST
- Header
- Authorization: Bearer {token}

Here are some sample messages

:point_down: Request
- /api/v1/bookings/pay/1

```json
{
    "message": "Hi"
}
```

:point_down: Response

```json
{
    "message": "Welcome to FlightBot! How can I help you today?",
    "type": "text"
}
```

:point_down: Request

```json
{
    "message": "Are there flights going from Enugu to Lagos today?"
}
```

:point_down: Response

```json
{
    "message": "Here are the available flights:\naero contractors flight 100: enugu to lagos at 10:06:11 AM - $50000 (10 seats available)",
    "type": "text",
    "flights": [
        {
            "id": 1,
            "flightName": "aero contractors flight 100",
            "departureCity": "enugu",
            "arrivalCity": "lagos",
            "departureTime": "2025-09-16T09:06:11.000Z",
            "arrivalTime": "2025-09-16T11:07:27.000Z",
            "availableSeats": 10,
            "ticketPrice": 50000
        }
    ]
}
```

:point_down: Request

```json
{
    "message": "Are there flights going from Enugu to Lagos tomorrow?"
}
```

:point_down: Response

```json
{
    "message": "Sorry, I couldn't find any flights matching your criteria.",
    "type": "text"
}
```
:point_down: Request

```json
{
    "message": "Detail about flight 1"
}
```

:point_down: Response

```json
{
    "message": "Flight: aero contractors flight 100\nRoute: enugu to lagos\nDeparture: 9/16/2025, 10:06:11 AM\nArrival: 9/16/2025, 12:07:27 PM\nAvailable seats: 10\nPrice: $50000\n\nWould you like to book this flight?",
    "type": "text",
    "data": {
        "id": 1,
        "flightName": "aero contractors flight 100",
        "departureCity": "enugu",
        "arrivalCity": "lagos",
        "departureTime": "2025-09-16T09:06:11.000Z",
        "arrivalTime": "2025-09-16T11:07:27.000Z",
        "availableSeats": 10,
        "ticketPrice": 50000,
        "createdAt": "2025-09-16T06:10:01.000Z",
        "updatedAt": "2025-09-16T06:10:01.000Z"
    }
}
```
:point_down: Request

```json
{
    "message": "I would like to book 2 seats in flight 1"
}
```

:point_down: Response

```json
{
    "message": "Booking confirmed!\n\nBooking #: 1\nFlight: aero contractors flight 100\nRoute: enugu to lagos\nDeparture: 9/16/2025, 10:06:11 AM\nPassengers: 2\nTotal: $100000\nStatus: confirmed",
    "type": "text",
    "data": {
        "bookingDate": "2025-09-16T09:16:06.394Z",
        "id": 1,
        "userId": 2,
        "flightId": 1,
        "passengerCount": 2,
        "totalPrice": 100000,
        "status": "confirmed",
        "updatedAt": "2025-09-16T09:16:06.395Z",
        "createdAt": "2025-09-16T09:16:06.395Z"
    }
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---



<p align="right"><a href="#readme-top">back to top</a></p>

---

## This project covers
- Natural learning processing
- Database Modelling
- Database Management
- Test Driven Development
- User Authentication 
- User Authorization
- Documentation

<p align="right"><a href="#readme-top">back to top</a></p>

---


<!-- Contact -->

## Contact

- Twitter - [@OnyekaAnn1](https://twitter.com/OnyekaAnn1)
- email - Onyekaann17@gmail.com

<p align="right"><a href="#readme-top">back to top</a></p>

---

