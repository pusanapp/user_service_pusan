'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user_auth,{
        foreignKey: 'auth_id',
        as: 'user_auth'
      })
    }
  };
  user_profile.init({
    auth_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    address: DataTypes.TEXT,
    district: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    gender: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    district_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_profile',
  });
  return user_profile;
};
