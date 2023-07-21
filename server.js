const express = require('express');
const app = require('./app');
const sequelize = require('sequelize')
const helmet = require("helmet")
const cookieParser = require('cookie-parser');
const status = require('http-status');
console.log(status.INTERNAL_SERVER_ERROR);

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(helmet())
app.use(sequelize())


//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: true }).then(() => {
  console.log("db has been re sync")
})

// Add your routes here

app.listen(port, () => {
  console.log(`Server is connected on ${port}`);
});
