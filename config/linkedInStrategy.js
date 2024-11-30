const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

module.exports = (passport) => {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/auth/linkedin/callback',
        scope: ['r_liteprofile', 'r_emailaddress']
    }, (accessToken, refreshToken, profile, done) => {
        // Process user data
        return done(null, profile);
    }));
};
