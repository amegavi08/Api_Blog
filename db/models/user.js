'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
    User.belongsTo(models.Role, {foreignKey: 'roleId', as: 'user_role', targetKey: 'id'})
    
    }
  };
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "firstname is required",
        },
        notEmpty: true,
      }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "lastname is required",
          },
          notEmpty: true,
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "username is required",
          },
          notEmpty: true,
        }
      },
    email:{
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "phonenumber is required",
          },
          notEmpty: true,
        }
      },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "password is required",
        },
        notEmpty: true,
      }
    },
    imageUpload: {
        type:DataTypes.STRING,
        required: true,
      },
      roleId: {
        type:DataTypes.INTEGER,
        allowNull:false,
        required: true
      },  

    //isVerified is set to default false once a user signs up
        //this will change later after email has been verified
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }    
          
  }, {
    sequelize,
    modelName: 'User',
  } , {timestamps: true},);
  
  return User;
};