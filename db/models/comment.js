'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Comment.belongsTo(models.User, {foreignKey: 'user_Id', as: 'user_post', targetKey:'id'})
        Comment.belongsTo(models.Post, {foreignKey: 'postId', as: 'post_comment', targetKey:'id'})
    }
  };
  Comment.init({
    user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    userComments: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "comment is required",
        },
        notEmpty: true,
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Comment',
  }, {timestamps: true},);
  return Comment;
};