'use strict';
module.exports = function(sequelize, DataTypes) {
  var BlogPost = sequelize.define('BlogPost', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Comment);
      }
    }
  });
  return BlogPost;
};
