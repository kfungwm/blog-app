'use strict';
module.exports = function(sequelize, DataTypes) {
  var Blogger = sequelize.define('blogPost', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Blogger;
};
