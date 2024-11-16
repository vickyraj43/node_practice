const mongoose = require("mongoose");

const connectDB = async () => {
    try{
    await mongoose.connect("mongodb://localhost:27017/tinderDB");
    console.log("Connected to MongoDB");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;