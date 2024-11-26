const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user");
const utility = require('./utility/utility');
const cookieParser = require('cookie-parser');
const { isUserAuthenticated } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const SUCCESS = require('./constants/success');
const VALIDATION_ERRORS = require('./constants/validationErrors');
const processErrorHandler = require('./middleware/processErrorHandler');
const dotenv = require('dotenv').config();

//API Routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRequestRouter = require('./routes/connectionRequest');
const reviewRouter = require('./routes/review');
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(isUserAuthenticated);

//API Routes
app.use('/auth' , authRouter);  
app.use('/profile' , profileRouter);
app.use('/connection' , connectionRequestRouter);
app.use('/request' , reviewRouter);

app.use('*' , (req, res, next) => {
    const err =  utility.generateError(VALIDATION_ERRORS.INVALID_PATH , 'NotFoundError' , req.path);
    next(err)
});

app.use(errorHandler.handleError);
connectDB().then(() => {
app.listen(3000 , () =>{
    console.log('Server is running on port 3000');
}) ;
}).catch((err) => {
    console.log(err);
})

processErrorHandler();
