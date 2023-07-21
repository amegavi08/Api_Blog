
//importing modules
const express = require("express");
const {User} = require("../db/models");
const jwt = require('jsonwebtoken');

// const createAccessToken = require('../utils');
//Assigning db.users to User variable
//  const User = db.users;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
 const saveUser = async (req, res, next) => {
 //Search the database to see if user exist
 try {
  const emailRegexp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneNum = /^\d{10}$/;
  if(emailRegexp.test(req.body.email) && phoneNum.test(req.body.phonenumber)){
    const username = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    //if username exist in the database respond with a status of 409
    if (username) {
      return res.status(409).send({status:"Conflict", message: "Username already taken"});
    }
 
    //checking if email already exist
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
 
    //if email exist in the database respond with a status of 409
    if (emailcheck) {
      return res.status(404).send({status: "Not found" ,message:"Email already exist"});
    }
 
    const number = await User.findOne({
     where: {
       phonenumber: req.body.phonenumber,
     },
   });
   //if username exist in the database respond with a status of 409
   if (number) {
     return res.status(409)
     .send({status:"Conflict", message: "Phone number already exist"});
   }

  } else{
    return res.status(400)
    .send({status:"Bad Request", Message:"Invalid Email Account or Phone number"});
  }
  
   next();
 } catch (error) {
   console.log(error);
 }
};


const verifyTokenAndGetUserId = (req) => {
  try {
    const bearerHeader = req.headers.authorization;
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    // Verify the token
    const decodedToken = jwt.verify(bearerToken, process.env.JWT_ACCESS_SECRET); // Replace 'YOUR_SECRET_KEY' with your JWT secret key

    // Extract the user_id from the decoded token
    const id = decodedToken.userId;
    return id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

//exporting module
 module.exports = {
 saveUser,
 verifyTokenAndGetUserId
};


  

