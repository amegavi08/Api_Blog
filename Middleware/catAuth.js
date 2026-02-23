
//importing modules
const express = require("express");
const {Post,Category} = require("../db/models");


//Function to check if postCategory is not in the category database
//this is to avoid having two users making post with categories that is not in the database 
 const saveCat = async (req, res, next) => {
 //Search the database to see if user exist
 try {
    const post = await Post.findOne({
      where: {
        postcategory: req.params.postcategory,
      },
      include: {
        model: Category,
        attributes: ['id', 'postCategory'], // Include only specific attributes of the category if needed
        as: 'results'
      },
    });

    if (post) {
      // The post is found
      if (post.Category.postCategory == post.postcategory){
      // The post has a category associated to it
      console.log('Post category:', post.Category.postCategory);
      return res.status(200).send({status:"Success", message: "The post has a category associated to it"});
      } else {
      // The post has no associated category
      console.log('Post has no category associated.');
      return res.status(400).send({status:"Bad request", message: "The post has no associated category"});
      
      }
    } else {
      // The post is not found
      return res.status(401).send({status:"Not Found", message: "The post is not found"});

    }
   next();
 } catch (error) {
  console.log(error)
  return res.status(500).send({status:"Error", message: "Internal Server Error"});
 }
};


//exporting module
 module.exports = {
  saveCat,
};





