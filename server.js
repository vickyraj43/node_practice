const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user");
app.use(express.json());

app.post('/user', async (req, res) => {
    try{
        console.log("user route called");
        const userObj = req.body;
        console.log(userObj);
        const user = new User(userObj);
        await user.save();
        res.status(201).send("User created successfully");
    }catch(err){
        console.log(err);
        res.status(500).send(`Something went wrong: ${err}`);
    }
});

app.get('/user/:id', async (req, res) => {
    try{
        // const users = await User.find({}); //find all users
        // const users = await User.find({age: {$gt: 1}}); //find users with age greater than 20
        // const user = await User.findById({_id: "67372e97a1a512d400ed5e1e"}); //find user with specific id
        // const user = await User.findById(req.params.id); //find user with specific id
        const user = await User.findOne({_id: req.params.id});
        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(500).send(`Something went wrong: ${err}`);
    }

});

app.put('/user/:id', async (req, res) => {
    try{
        const user = req.body;
        const updatedUser = await User.findOneAndReplace({_id: req.params.id}, user, {new: true});
        console.log(updatedUser);
        res.status(200).send("User updated successfully");
    }catch(err){
        console.log(err);
        res.status(500).send(`Something went wrong: ${err}`);
    }
});

app.patch('/user/:id', async (req, res) => {
    try{
        const user = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$setuser}, {new: true});
        console.log(updatedUser);
        res.status(200).send("User updated successfully");
    }catch(err){
        console.log(err);
        res.status(500).send(`Something went wrong: ${err}`);
    }
});

app.delete('/user/:id', async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params?.id);
        console.log(deletedUser);   
        res.status(200).send("User deleted successfully");
    }catch(err){
        console.log(err);
        res.status(500).send(`Something went wrong: ${err}`);
    }
});

connectDB().then(() => {
app.listen(3000 , () =>{
    console.log('Server is running on port 3000');
}) ;
}).catch((err) => {
    console.log(err);
})
