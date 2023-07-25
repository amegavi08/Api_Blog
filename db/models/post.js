'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

    static associate(models) {
      Post.hasMany(models.Comment, { as: 'post_comment',  foreignKey: 'postId' ,targetKey:'id'});
      Post.hasMany(models.Category, { as: 'post_category',  foreignKey: 'postId' ,targetKey:'id'});
    }};
  Post.init({
    user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "authorname is required",
        },
        notEmpty: true,
      }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "title is required",
          },
          notEmpty: true,
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "description is required",
          },
          notEmpty: true,
        }
      },
    imageUpload: {
        type:DataTypes.STRING,
        required: true,
      },
  }, {
    sequelize,
    modelName: 'Post',
  } , {timestamps: true},);
  
  return Post;
};