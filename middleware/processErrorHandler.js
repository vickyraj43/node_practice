const mongoose = require('mongoose');
// const server = require('../server');
const processErrorHandler = () => {
    process.on('uncaughtException' , (err , req , res , next) => {
        console.error({
            message: 'Uncaught Exception',
            error: err,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
        
            process.exit(1);
    });

    process.on('unhandledRejection' , (err) => {
        console.error({
            message: 'Unhandled Rejection',
            stack: err?.stack,
            timestamp: new Date().toISOString()
        });
       
            console.log("Server closed");
            process.exit(1);
    });

    process.on('SIGTERM' , async(err) => {
        try{
        console.log('SIGTERM signal received');
        await mongoose.connection.close();
        process.exit(0);
        
       }catch(err){
            console.error({
                message: 'SIGTERM error',
                error: err,
                stack: err?.stack,
                timestamp: new Date().toISOString()
            });
            res.status(500).send("Internal Server Error");
            process.exit(1);
        }
    })
}

module.exports = processErrorHandler;