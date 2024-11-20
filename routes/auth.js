const express = require('express');
const utility = require('../utility/utility');
const router = express.Router();
const User = require('../models/user');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const SUCCESS = require('../constants/success');
const { isUserAuthenticated } = require('../middleware/auth');

router.post('/signup' , async (req, res , next) => {
    try{
        console.log("user route called");
        const {firstName , lastName , emailId , password} = req.body;
        //input validation
        if(!firstName || !lastName || !emailId || !password){
            throw utility.generateError(VALIDATION_ERROR.REQUIRED_FIELDS, "ValidationError", req.path);
        }
        const hashedPassword = await utility.hashPassword(password);
        const signinUser = {
            firstName,lastName,emailId,password:hashedPassword
        }
        const user = new User(signinUser);
        await user.save();
        res.status(201).send(SUCCESS.USER_CREATED);
    }catch(err){
        next(err);
    }
});

router.post('/login' , async (req, res, next) => {
    try{
        console.log("login route called");
        const {emailId , password} = req.body;
        if(!emailId || !password){
            throw utility.generateError(VALIDATION_ERRORS.REQUIRED_FIELDS , 'ValidationError' , req.path);
        }
        const user = await User.findOne({emailId});
        if(!user){
            throw utility.generateError(VALIDATION_ERRORS.NOT_FOUND , 'NotFoundError' , req.path);
        }
        if(emailId === user.emailId && await utility.comparePassword(password, user.password)){
            const generatedToken = await utility.generateToken(user._id);
            res.cookie('token', generatedToken );
            res.status(200).send("Login successful");
        }else{
            throw utility.generateError(VALIDATION_ERRORS.INVALID_CREDENTIALS , 'JsonWebTokenError' , req.path);
        }
    }catch(err){
        next(err);
    }
});

router.get('/logout' , async (req , res , next) => {
    try{
        res.clearCookie('token'); //clear the token cookie from the browser
        res.status(200).send("Logout successful");
    }catch(err){
        next(err);
    }
})

router.patch('/change-password' , isUserAuthenticated , async (req , res , next) => {
    try{
    /*
    Password change ke liye hume ye steps follow karne honge:

    1. User se 3 fields leni hogi:
       - currentPassword (purana password verify karne ke liye)
       - newPassword (naya password jo set karna hai)
       - confirmPassword (naye password ko confirm karne ke liye)
       2. Validation checks:
       - Saare fields required hain
       - newPassword aur confirmPassword match hone chahiye
       - currentPassword database mein stored password se match hona chahiye
       - newPassword purane password se alag hona chahiye
       - newPassword security requirements meet karna chahiye (length, special chars etc)
       utility.validatePassword(newPassword);
       3. Process:
       - Pehle current password verify karenge
       - Phir naya password hash karenge
       - Finally user ka password update kar denge
       
       4. Response:
       - Success pe "Password updated successfully" message
       - Error cases mein appropriate validation messages
       */
   const {currentPassword , newPassword , confirmPassword} = req.body;
   if(!currentPassword || !newPassword || !confirmPassword){
    throw utility.generateError(VALIDATION_ERRORS.REQUIRED_FIELDS , 'ValidationError' , req.path);
   }
   const {password} = await User.findOne({_id: req?.user?.id});
   if(!password){
    throw utility.generateError(VALIDATION_ERRORS.INVALID_CURRENT_PASSWORD , 'NotFoundError' , req.path);
   }
   const passwordChangeRequest = {
        dbPassword: password,
        currentPassword,
        newPassword,
        confirmPassword
   }
  
   const isValidPassword = await utility.validatePassword(passwordChangeRequest);
   if(isValidPassword){
    const newPasswordHashed = await utility.hashPassword(newPassword);
    await User.updateOne({_id: req.user.id}, {$set: {password: newPasswordHashed}});
    res.status(200).send(SUCCESS.PASSWORD_UPDATED);
   }
   }catch(err){
        next(err);
    }
});

module.exports = router;
