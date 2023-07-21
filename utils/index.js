const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const e = require('express');
require("dotenv").config();

   const  createToken = ({id})  => {
     return jwt.sign({userId : id}, process.env.JWT_SECRET, {expiresIn: '5m'});
   };

   const  createAccessToken = ({id})  => {
    return jwt.sign({userId : id}, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'});
  };

  const  generateRefreshToken = ({id})  => {
    return jwt.sign({userId : id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '5m'});
  };

   const verifyUserToken = (token) =>{
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    return decode;
  
  };

  const verifyEmpToken = (token) =>{
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    return decode;
  
  };

   const  resetpassToken = ({id})  => {
    return jwt.sign({userId : id}, process.env.JWT_SECRET, {expiresIn: '7days'});
  };

  const verifyToken = (setToken) =>{
    const decode = jwt.verify(setToken,process.env.JWT_RESET_PASSWORD);
    return decode;

 };

 module.exports = {createToken,createAccessToken,generateRefreshToken,verifyUserToken,verifyEmpToken}