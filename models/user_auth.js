'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.user_profile,{
        foreignKey: 'auth_id',
        as: 'user_profile'
      })
    }
  };
  user_auth.init({
    user_id: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_auth',
  });
  return user_auth;
};
