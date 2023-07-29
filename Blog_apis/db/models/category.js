'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Category.belongsTo(models.User, {foreignKey: 'user_Id', as: 'user_category', targetKey:'id'})
        // Category.belongsTo(models.Post, {foreignKey: 'postId', as: 'post_category', targetKey:'id'})
    }
  };
  Category.init({
    user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    postCategory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "category is required",
        },
        notEmpty: true,
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Category',
  }, {timestamps: true},);
  return Category;
};