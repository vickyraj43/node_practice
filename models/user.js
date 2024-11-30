const mongoose = require('mongoose');
const validator = require('validator');
const VALIDATION_ERRORS = require('../constants/validationErrors');


const userSchema = new mongoose.Schema({
    googleId:{
        type: String,
      },
    firstName :{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        validate: {
            validator: function(v){
                
                return /^[a-zA-Z\s]+$/.test(v); 
            },
            message: props => {
                return `${props.value} ${VALIDATION_ERRORS.INVALID_FIRST_NAME}`
            }
        }
    },
    lastName :{
        type: String,
        minlength: 3,
        maxlength: 30,
        validate:{
            validator: function(v){
                return /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} ${VALIDATION_ERRORS.INVALID_LAST_NAME}`
        }
    },
    emailId :{
        type: String,
        required: true,
        unique:true,
        validate: {
            validator: function(v){
                return validator.isEmail(v);
            },
            message: props => `${props.value} ${VALIDATION_ERRORS.INVALID_EMAIL_ID}`
        }
    },
    password :{
        type: String,
        validate: {
            validator: function(v){
                return validator.isStrongPassword(v);
            },
            message: props => `${props.value} ${VALIDATION_ERRORS.PASSWORD_NOT_STRONG}`
        }
    },
    profilePicture:{
        type: String,
    },
    age:{
        type: Number,        
    },
    gender:{
        type: String,
        validate:{
            validator: function(v){
                if(v.toLowerCase() == 'male' || v.toLowerCase() == 'female' || v.toLowerCase() == 'others'){
                    return true;
                }
                return false;
            },
            message: props => `${props.value} ${VALIDATION_ERRORS.INVALID_GENDER}`
        }
    },
    jobTitle:{
        type: String,
        default: 'Software Engineer',
    },
    skills:{
        type: [String],
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;

