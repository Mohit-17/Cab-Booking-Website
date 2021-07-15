const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');   

passport.serializeUser((user,done) => {
    done(null, user.id);

});
passport.deserializeUser((id,done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});



passport.use(
    new GoogleStrategy({
        //options for the google stategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL:'/auth/google/redirect',
        proxy:true
    },(accessToken, refreshToken,profile,done) => { 
        //check if user already exists in our database
        console.log(profile);
        User.findOne({googleId:profile.id}).then((currentUser) => {
            if(currentUser) {
                //already have the user
                done(null, currentUser);
            } else {
                //if not,create new user in our db
                new User({
                    googleId:profile.id,
                    username:profile.displayName
               }).save().then((newUser) => {
                   done(null,newUser);
               });
            }
        });
    })
);