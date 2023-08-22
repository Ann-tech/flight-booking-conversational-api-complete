const { Sequelize } = require('sequelize');

const dbConfig = require('../config/dbConfig');
const User = require('./users.model');
const Role = require('./roles.model');
const Flight = require('./flights.model');
const Booking = require('./bookings.model');

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialet,
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.log('Unable to connect to the database:', err);
    })

const db = {}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add our tables
db.users = User(sequelize);
db.roles = Role(sequelize);
db.flights = Flight(sequelize);
db.bookings = Booking(sequelize);


// sync all models
// force: false will not drop the table if it already exists
db.sequelize.sync({ force: true })
    .then(async () => {
        console.log('Database & tables synced');

        //add roles to db
        await db.roles.create({name: "admin"});
        await db.roles.create({name: "user"});
    }).catch(err => {
        console.error('Unable to sync database & tables:', err);
    })

module.exports = {
    db,
    User: db.users,
    Flight: db.flights,
    Booking: db.bookings
};

