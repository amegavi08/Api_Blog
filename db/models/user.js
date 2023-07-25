'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
    User.belongsTo(models.Role, {foreignKey: 'roleId', as: 'user_role', targetKey: 'id'})
    
    }
  };

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - username
 *         - email
 *         - password
 *         - phonenumber
 *         - imageUpload
 *         - roleId
 *       properties:
 *         id:
 *           type: integer
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phonenumber:
 *           type: string
 *         password:
 *           type: string
 *         imageUpload:
 *           type: string
 *         roleId:
 *           type: integer
 *       example:
 *         id: 9
 *         firstname: Ama
 *         lastname: Ampomaa
 *         username: legend
 *         email: ama@gmail.com
 *         phonenumber: 0543987461
 *         password: hdgnioguijfg
 *         imageUpload: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
 *         roleId: 2
 */

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