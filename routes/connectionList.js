const express = require('express');
const mongoose = require('mongoose');
const { isUserAuthenticated } = require('../middleware/auth');
const router = express.Router();
const connectionRequest = require('../models/connectionRequest');
const { CONNECTION_REQUEST_STATUS } = require('../constants/message');


router.get('/list', isUserAuthenticated, async (req , res , next) => {
    //only login user can see connection list other than that show error your are authorized
     const {_id} = req.user;
     //find all connection request where user id is either fromUserId or toUserId
     const connectionRequestData = await connectionRequest.find(
        {$or: [{fromUserId: _id ,status :CONNECTION_REQUEST_STATUS.ACCEPTED}, 
        {toUserId: _id , status: CONNECTION_REQUEST_STATUS.ACCEPTED}]})
     .populate("fromUserId", "firstName lastName emailId");
     if(!connectionRequestData){
         throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND, 'NotFoundError', 'connectionRequestController');
     }
     res.status(200).json(
        {
            message: 'Connection List Fetched Successfully',
            data: connectionRequestData,
            success: true
        }
     );
}
);
module.exports = router;