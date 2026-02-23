const express = require('express');
const bodyParser = require('body-parser');
const dBase = require('./dBase');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const port = process.env.PORT;

// Routes initialization
const userRoute = require('./routers/user');
const postRoute = require('./routers/post');
const commentRoute = require('./routers/comment');
const categoryRoute = require('./routers/category');

// Swagger definition
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Swagger API',
            version: '1.0.0',
            description: 'This is used for testing APIs for a blog',
        },
        servers: [
            {
                url: `http://localhost:${port}/`,
                description: 'Development server'
            },
        ],
    },
    apis: ["./routers/*.js", "./models/*.js"] // Adjust path to your models
};

// Initialize swaggerJSDoc
const swaggerSpec = swaggerJSDoc(options);

// Middleware
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.send("Blog API is working");
});

// Swagger documentation route
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON endpoint for swagger spec
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Import Routes
app.use('/', userRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);
app.use('/category', categoryRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api`);
    console.log(`Swagger JSON at http://localhost:${port}/swagger.json`);
});

// app.listen(3005);