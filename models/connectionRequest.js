const mongoose = require('mongoose');
const {CONNECTION_REQUEST_STATUS} = require('../constants/message');
const utility = require('../utility/utility');
const User = require('./user');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const connectionRequestModel = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type: String,
        enum: [CONNECTION_REQUEST_STATUS.IGNORE, CONNECTION_REQUEST_STATUS.INTERESTED, CONNECTION_REQUEST_STATUS.ACCEPTED, CONNECTION_REQUEST_STATUS.REJECTED],
    }
    },
    {timestamps: true}
);


// Ye code connection request ke validation ke liye hai
// 1. Check karta hai ki user khud ko hi request na bhej raha ho
// 2. Check karta hai ki same users ke beech already koi request exist na karti ho
//
// Pre-save middleware:
// - fromUserId aur toUserId same nahi hone chahiye
// - Agar new connection request hai:
//   - Check kare ki koi existing request hai ya nahi (dono direction mein)
//   - Agar existing request milti hai to error throw kare
//
// Parameters:
// - connectionRequest: Current connection request document
// - fromUserId: Request bhejne wale user ka ID 
// - toUserId: Request receive karne wale user ka ID
// - status: Request ki current status (ignore/interested/accepted/rejected)
//
// Returns:
// - Error agar validation fail ho jaye
// - Next middleware ko call karta hai agar validation pass ho jaye
// Pre-save middleware ke liye User model ko import karna zaroori hai


connectionRequestModel.pre('save', async function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId === connectionRequest.toUserId){
        // throw new Error('From and to user cannot be the same');
        throw utility.generateError(VALIDATION_ERRORS.FROM_AND_TO_USER_CANNOT_BE_THE_SAME , 'ValidationError' , 'connectionRequestModel');
    }
    //User exist karta hai ya nahi check karne ke liye
    const user = await User.findById(connectionRequest?.fromUserId);
    if(!user){
        throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , 'connectionRequestModel');
    }
    if(connectionRequest.isNew){
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: connectionRequest.fromUserId, toUserId: connectionRequest.toUserId},
                {fromUserId: connectionRequest.toUserId, toUserId: connectionRequest.fromUserId}
            ]
        });
        if(existingConnectionRequest){
            throw utility.generateError(VALIDATION_ERRORS.CONNECTION_REQUEST_ALREADY_EXISTS , 'ValidationError' , 'connectionRequestModel');
        }
    }
    next();
})
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestModel);
module.exports = ConnectionRequest;
