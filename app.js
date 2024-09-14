require('dotenv').config();
require('express-async-errors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// routers
const authRouter = require('./routes/auth');

// routes
app.use(express.json());
app.use(bodyParser.json());
app.use('api/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port  = process.env.PORT || 3000;

const start = async () => {
    try {
        // await connectDB(process.env.MONGO_URI);
        app.listen(port ,  console.log(`Server listening on port ${port}...`))
        
    } catch (error) {
        console.log(error);
    }
};

start();