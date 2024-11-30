const express = require('express');//-
const router = express.Router();//-
const VALIDATION_ERRORS = require("../constants/validationErrors");//-
const utility = require("../utility/utility");//-
const { isUserAuthenticated } = require('../middleware/auth');//-
const ConnectionRequest = require('../models/connectionRequest');//-
const { CONNECTION_REQUEST_STATUS } = require('../constants/message');//-
const VALID_STATUS = ['ACCEPTED', 'REJECTED', 'PENDING'];//-
/************************************************************************************************
 * Handles the review of a connection request, allowing authorized users to accept or reject requests.//+
 * @param {Object} req - The request object.//+
 * @param {Object} req.params - The route parameters.//+
 * @param {string} req.params.requestId - The ID of the connection request to be reviewed.//+
 * @param {string} req.params.status - The new status for the connection request (ACCEPTED, REJECTED, or PENDING).//+
 * @param {Object} req.user - The authenticated user object.//+
 * @param {string} req.user.id - The ID of the authenticated user.//+
 * @param {Object} res - The response object.//+
 * @param {Function} next - The next middleware function.//+
 * @returns {Object} JSON response with success status, message, and updated connection request data.//+
 * @throws {Error} If the request parameters are invalid, status is invalid, request is not found, //+
 *                 user is unauthorized, request is already processed, or status is not allowed.//+
 ***************************************************************************************/
router.post('/review/:requestId/:status', isUserAuthenticated, async(req , res , next) => {
    try{
        const {requestId , status} = req.params;
        const {id} = req.user;
        if(!requestId || !status || !id ){
            throw utility.generateError(VALIDATION_ERRORS.INVALID_REQUEST_PARAMS , 'ValidationError' , 'connectionRequestController');
        }


        // Status value validation
        if (!VALID_STATUS.includes(status.toUpperCase())) {
            throw utility.generateError('Invalid status value', 'ValidationError', 'connectionRequestController');
        }

        // Find and validate connection request
        const connectionRequest = await ConnectionRequest.findById(requestId);
        if(!connectionRequest){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , 'connectionRequestController');
        }
        //only admin can accept or reject the request
        if(id !== (connectionRequest.toUserId).toString()) {
            throw utility.generateError(VALIDATION_ERRORS.UNAUTHORIZED , 'UnauthorizedError' , 'connectionRequestController');
        }
        // Check if request is already processed
        if (connectionRequest.status === CONNECTION_REQUEST_STATUS.ACCEPTED || 
            connectionRequest.status === CONNECTION_REQUEST_STATUS.REJECTED) {
            throw utility.generateError('Request already processed', 'ValidationError', 'connectionRequestController');
        }
        if([CONNECTION_REQUEST_STATUS.IGNORE , CONNECTION_REQUEST_STATUS.INTERESTED].includes(status.toLowerCase())){
            throw utility.generateError(VALIDATION_ERRORS.INVALID_STATUS , 'ValidationError', 'connectionRequestController');
        }
        connectionRequest.status = status;
        await connectionRequest.save();

        res.status(200).json({
            success: true,
            message: `Request ${status.toLowerCase()} successfully`,
            data: connectionRequest
        });

    }catch(err){
        next(err);
    }
})
module.exports = router;
