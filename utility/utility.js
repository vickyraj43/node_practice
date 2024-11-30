const utility = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

utility.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds
    const hashedPassword = await bcrypt.hash(password , salt);
    return hashedPassword;
}

utility.comparePassword = async (password , hashedPassword) => {
    const comparedPassword = await bcrypt.compare(password , hashedPassword);
    return comparedPassword
}

utility.generateToken = async (id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});
    console.log(token);
    return token;
}

utility.verifyToken = async (token) => {
    const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
    return decodedToken;
}

utility.generateError =  (message , name , path) => {
    const error = new Error(message);
    error.name = name;
    error.path = path;
    return error;
}

utility.validatePassword = async (password) => {
    const {dbPassword , currentPassword , newPassword , confirmPassword} = password;
    if(!validator.isStrongPassword(newPassword)){
        throw utility.generateError(VALIDATION_ERRORS.STRONG_PASSWORD_REQUIRED , 'ValidationError' , req.path);
    }else if(!(await utility.comparePassword(currentPassword , dbPassword))){
       throw utility.generateError(VALIDATION_ERRORS.INVALID_CURRENT_PASSWORD , 'ValidationError' , req.path);
    }else if(newPassword !== confirmPassword){
        throw utility.generateError(VALIDATION_ERRORS.PASSWORD_MISMATCH , 'ValidationError' , req.path);
    }
    return true;
}

utility.generateChatResponse = async(prompt) => {
    console.log("prompt", prompt);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log("result", result);
    console.log("result", result.response);
    return result.response.text();
}
module.exports = utility;
