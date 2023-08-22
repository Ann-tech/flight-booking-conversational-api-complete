const { DataTypes } = require('sequelize');

function Flight(sequelize) {
    const FlightSchema = sequelize.define("Flight", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        flightName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'flightName field is required'
                }
            }
        },
        departureCity: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'departureCity field is required'
                }
            }
        },
        arrivalCity: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'arrivalCity field is required'
                }
            }
        },
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'depatureTime field is required'
                }
            }
        },
        arrivalTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'arrivalTime field is required'
                }
            }
        },
        availableSeats: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'availableSeats field is required'
                }
            }
        },
        ticketPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'ticketPrice field is required'
                }
            }
        }
    }, {
        tableName: 'flights',
    });
    

    return FlightSchema;
}

module.exports = Flight;