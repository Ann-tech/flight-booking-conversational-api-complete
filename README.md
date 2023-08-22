# flight-booking-conversational-api
An Api which can be integrated into a flight booking conversation bot application to facilitate flight ticket booking. This API allows users to book flights and also retrieve information on booked flights. This API integrates Dialogflow Natural Learning Processing System which enables flexible and dynamic interaction with the conversational API.

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
    "message": "Greetings! How can I assist?"
}
```

```json
{
    "message": "Are there flights available"
}
```

:point_down: Response

```json
{
    "success": true,
    "message": "Here is a list of all flights",
    "flights": [
        {
            "id": 1,
            "flightName": "air peace",
            "departureCity": "kaduna",
            "arrivalCity": "lagos",
            "departureTime": "2023-08-11T18:47:39.000Z",
            "arrivalTime": "2023-08-11T18:47:39.000Z",
            "availableSeats": 10,
            "ticketPrice": 50000,
            "createdAt": "2023-08-12T22:22:26.000Z",
            "updatedAt": "2023-08-12T22:31:38.000Z"
        }
    ]
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---



<p align="right"><a href="#readme-top">back to top</a></p>

---

## Lessons Learned
Things implemented during this project

- Test Driven Development
- Database Modelling
- Database Management
- Debugging
- User Authentication
- User Authorization
- Documentation
- Natural learning processing

<p align="right"><a href="#readme-top">back to top</a></p>

---


<!-- Contact -->

## Contact

- Twitter - [@OnyekaAnn1](https://twitter.com/OnyekaAnn1)
- email - Onyekaann17@gmail.com

Project Link: [Conversational-api](https://github.com/Ann-tech/flight-booking-conversational-api)

<p align="right"><a href="#readme-top">back to top</a></p>

---

