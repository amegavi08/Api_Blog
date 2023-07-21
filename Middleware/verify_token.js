const jwt = require("jsonwebtoken");
require("dotenv").config();
const
    {
      handleNoTokenResponse,
      handleInvalidTokenResponse,
      handleExpiredTokenResponse
    } = require("../utils/transactions-response");
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    
    handleNoTokenResponse(bearerHeader, res);
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  try {
    jwt.verify(bearerToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err)  handleExpiredTokenResponse(err, res);
      req.user = decoded.userId;

      next();
    });
  } catch (err) {
    // console.log(err)
    handleInvalidTokenResponse(err, res);
  }
};

module.exports = verifyToken;