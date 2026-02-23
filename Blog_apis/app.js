const express = require('express');
const bodyParser = require('body-parser');
const dBase = require('./dBase');
const path = require ('path');
const fs = require ('fs')
require('dotenv').config();                                                                                    
const secretKey = process.env.secretKey;
console.log(secretKey);
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const port = process.env.port || 3005

// Routes initialization
const userRoute = require('./routers/user');
const postRoute = require('./routers/post');
const commentRoute = require('./routers/comment');
const categoryRoute = require('./routers/category');

// swagger definition
// options for swagger jsdoc 
const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            openapi: '5.0.0',
            title: 'Node Swagger API',
            version: '6.2.8',
            description: 'This is used for the testing apis for a blog',
          },
        servers:[
        {
            url: 'http://localhost:3005/'
        },
    ],
    },
    apis: ["./routers/*.js","./db/models/*.js"] // path where API specification are written

  };
  
  // initialize swaggerJSDoc
  const swaggerSpec = swaggerJSDoc(options);

// Middleware
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.get('/',(req, res)=>{
    res.send("I am working");
});


// route for swagger.json
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec));

// Import Routes
app.use('/user', userRoute);
app.use('/post',postRoute);
app.use('/comment',commentRoute)
app.use('/category',categoryRoute)

app.listen(3005);