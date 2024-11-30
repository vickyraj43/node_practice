const VALIDATION_ERRORS = require("../constants/validationErrors");
const User = require("../models/user");
const utility = require("../utility/utility");
const mongoose = require("mongoose");
const middleware = {};
const publicRoutes = ["signup", "login"];
middleware.isUserAuthenticated = async (req, res, next) => {
    try{
        if(publicRoutes.includes(req?.url.split('/')[2])){
           return next();
        }
        if(!req?.cookies?.token){
            throw utility.generateError(VALIDATION_ERRORS.UNAUTHORIZED , 'UnauthorizedError' , req.path);
        }
        const isTokenValid = await utility.verifyToken(req?.cookies?.token);
        if(!isTokenValid){ 
            throw utility.generateError(VALIDATION_ERRORS.UNAUTHORIZED , 'UnauthorizedError' , req.path);
        }
        const user = await User.findById(isTokenValid.id);
        if(!user){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , req.path);
        }
        req.user = user;
        next();
    }catch(err){
       next(err);
    }
 }

module.exports = middleware;
