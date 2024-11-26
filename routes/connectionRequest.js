const express = require('express');
const { isUserAuthenticated } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();
const mongoose = require('mongoose');
router.post('/request/:status/:toUserId', isUserAuthenticated, async(req , res , next) => {
    try{
        const {status , toUserId} = req.params;
        const {id} = req.user;
        const connectionRequest = new ConnectionRequest({fromUserId: id, toUserId: toUserId, status});
        const savedConnectionRequest = await connectionRequest.save();
        res.status(200).json(savedConnectionRequest);
    } catch(err){
        next(err);
    }
});



module.exports = router;
