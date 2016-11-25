const bcrypt = require('bcrypt');


'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set: function(val) {
        this.setDataValue('passwordDigest', bcrypt.hashSync(val, 10));
      }
    },
    passwordDigest: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // this.belongsTo(models.User);
      }
    }
  });
  return User;
};
