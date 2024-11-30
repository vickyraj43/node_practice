const express = require('express');
const utility = require('../utility/utility');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const router = express.Router();

router.post('/prompt', async(req , res , next) => {
    try{
        console.log("inside body" , req?.body);
        const {prompt } =  req?.body;
        const response = await utility.generateChatResponse(prompt);
        if(!response){
            throw utility.generateError(VALIDATION_ERRORS.INVALID_PROMPT , 'ValidationError' , req.path);
        }
        res.json({
            "message" : response,
            "status" : "success",
            "statusCode" : 200
        })
    }catch(err){
        next(err);
    }
})

module.exports = router;