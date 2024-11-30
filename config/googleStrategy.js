const User = require('../models/user');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: "357403904695-tkc92srb1n2ntiq4lkslf8224oie2hfn.apps.googleusercontent.com" || process.env.GOOGLE_CLIENT_ID,
        clientSecret: "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" ||process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
        const signinUser = {
            googleId: profile.id,
            firstName: profile.displayName,
            emailId: profile.emails[0].value,
            profilePicture: profile.photos[0].value
        }
        const user = new User(signinUser);
        await user.save();
        console.log("User created successfully");
    }
    done(null , user);
        
    }));
};
