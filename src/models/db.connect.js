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
    dialect: dbConfig.dialect,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('Connection established.'))
  .catch(err => console.error('Unable to connect:', err));

const db = {
  sequelize,
  Sequelize,
  users: User(sequelize),
  roles: Role(sequelize),
  flights: Flight(sequelize),
  bookings: Booking(sequelize),
};

db.sequelize.sync() 
  .then(async () => {
    console.log('Database & tables synced');
    const count = await db.roles.count();
    if (count === 0) {
      await db.roles.bulkCreate([{ name: 'admin' }, { name: 'user' }]);
    }
  })
  .catch(err => console.error('Sync error:', err));

module.exports = {
  db,
  User: db.users,
  Flight: db.flights,
  Booking: db.bookings,
};
