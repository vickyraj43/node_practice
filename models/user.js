const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        validate: {
            validator: function(v){
                return /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid name`
        }
    },
    lastName :{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        validate:{
            validator: function(v){
                return /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid name`
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
            message: props => `${props.value} is not a valid email`
        }
    },
    password :{
        type: String,
        required: true,
        validate: {
            validator: function(v){
                return validator.isStrongPassword(v);
            },
            message: props => `${props.value} is not a strong password`
        }
    },
    age:{
        type: Number,        
    },
    gender:{
        type: String,
        required: true,
        validate:{
            validator: function(v){
                if(v.toLowerCase() == 'male' || v.toLowerCase() == 'female' || v.toLowerCase() == 'others'){
                    return true;
                }
                return false;
            },
            message: props => `${props.value} is not a valid gender`
        }
    },
    jobTitle:{
        type: String,
        default: 'Software Engineer',
    },
    skills:{
        type: [String],
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

