const { DataTypes } = require('sequelize');

function Role(sequelize) {
    const RoleSchema = sequelize.define('Role', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false
      }
      }, {
          tableName: 'roles',
    });

    return RoleSchema;
}


module.exports = Role;