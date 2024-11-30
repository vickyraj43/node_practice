const express = require('express');
const { isUserAuthenticated } = require('../middleware/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

router.get('/feed' , isUserAuthenticated , async(req , res , next) => {
    try{
        const page = req.query?.page || 1;
        const limit = req.query?.limit || 10;
        const skip = (page - 1) * limit;
        const logedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId: logedInUser._id},
                {toUserId: logedInUser._id}
            ]
        }).select("fromUserId toUserId").populate("fromUserId", "firstName lastName ");
        console.log(connectionRequest);

        const allConnectionRequest = new Set();
        connectionRequest.forEach(req => {
            allConnectionRequest.add(req.toUserId);
            allConnectionRequest.add(req.fromUserId);
        });

        const allUser = await User.find({
            $and: [
                {_id: {$nin: [...allConnectionRequest]}},
                {_id: {$ne: logedInUser._id}}
            ]
        }).select("firstName lastName emailId , profileImage").skip(skip).limit(limit);


        res.status(200).json({
            message: "User Fetched Successfully",
            data: allUser,
            success:true
        })
    }catch(err){
        next(err);
    }
})

module.exports = router;
