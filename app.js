require('dotenv').config();
require('express-async-errors');
const bodyParser = require('body-parser');
const express = require('express');

//connect db
const connectDB = require('./db/connectDB');
const app = express();
// const authenticateUser = require('./middleware/authentication');

// routers
const authRouter = require('./routes/auth');
const otpRouter = require ('./routes/otp');
const forgotPasswordRouter  = require('./routes/passwordReset');
const usersRouter = require('./routes/auth');
const userCategoryRouter =  require('./routes/auth');
const uploadDocumentRouter = require('./routes/uploadTaxDocument')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// routes
app.use(express.json());
app.use('/auth', authRouter);
app.use('/otp', otpRouter);
app.use('/user', forgotPasswordRouter);
app.use('/user', userCategoryRouter)
app.use('/users', usersRouter);
app.use('/user', uploadDocumentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port  = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port ,  console.log(`Server listening on port ${port}...`))
        console.log('MongoDB connected successsfully');
        
    } catch (error) {
        console.log(error);
    }
};

start();