const express = require('express');
const { isUserAuthenticated } = require('../middleware/auth');
const User = require('../models/user');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const utility = require('../utility/utility');
const SUCCESS = require('../constants/success');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();


router.get('/view/:id' , isUserAuthenticated , async(req , res , next) => {
    try{
        // const users = await User.find({}); //find all users
        // const users = await User.find({age: {$gt: 1}}); //find users with age greater than 20
        // const user = await User.findById({_id: "67372e97a1a512d400ed5e1e"}); //find user with specific id
        // const user = await User.findById(req.params.id); //find user with specific id
        
        const user = await User.findOne({_id: req.params?.id});
        if(!user){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , req.path);
        }
        res.status(200).send(user);
    }catch(err){
        next(err);
    }
});

router.get('/view' , isUserAuthenticated , async (req, res , next) => {
    try{
        const userList = await User.find({}); //find all users
        res.status(200).json(userList);
    }catch(err){
        next(err);
    }
});

router.patch('/edit/:id' , isUserAuthenticated , async (req, res , next) => {
    try{
        const user = req.body;
        if(!user){
            throw utility.generateError(VALIDATION_ERRORS.REQUIRED_FIELDS , 'ValidationError' , req.path);
        }
        const userExist = await User.findByIdAndUpdate(req.params.id , user , {new: true});
        if(!userExist){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , req.path);
        }
        res.status(200).json(SUCCESS.USER_UPDATED);
    }catch(err){
        next(err);
    }
});

router.delete('/delete/:id' , isUserAuthenticated , async (req, res , next) => {
    try{
        console.log('profiele delete ', req.params?.id);
        const user = await User.findByIdAndDelete(req.params?.id);
        if(!user){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , req.path);
        }
        res.status(200).json(SUCCESS.USER_DELETED);
    }catch(err){
        next(err);
    }
});

router.get('/request/received' , isUserAuthenticated, async function(req, res , next) {
    try{
        const logedInUser = req.user;
        console.log(logedInUser._id, logedInUser.id);
        const connectionRequest = await ConnectionRequest.find({toUserId: logedInUser._id})
        .populate("fromUserId", ["firstName", "lastName","lastName","status", "email"]);
        if(!connectionRequest){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND, 'NotFoundError', req.path);
        }
        res.status(200).json({
            message: "All requests fetched successfully.",
            data: connectionRequest,
            statusCode: 200
        });
    }catch(err){    
        next(err);
    }
});
module.exports = router;