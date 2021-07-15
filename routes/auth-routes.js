const router = require('express').Router();
const passport = require('passport');
const Client = require('../models/Client-model');
const Driver = require('../models/Driver-model');

//auth login 
router.get('/login', (req,res) => { 
    res.render('login');
});

//auth logout
router.get('/logout', (req,res) => {
    //hande with passport 
    req.logOut();
    res.redirect('/register');
})

//auth with google
router.get('/google',passport.authenticate('google', {
    scope: ['profile']
})); 


//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    // res.send(req.user);
    let array = [];
    Client.findOne({googleId:req.user.googleId}).then(User => {
        if(User){
            // res.render('client_profile',{username:User.name,contact:User.contact,address:User.address});
            res.redirect('/profile');
        } else {
            Driver.findOne({googleId:req.user.googleId}).then(User => {
                if(User){
                    // res.render('driver_profile',{username:User.name,contact:User.contact,type:User.type,address:User.address});
                    res.redirect('/profile');
                } else {
                    res.render('register_cab', {array:array} );
                }
            });
        }
    });
});
module.exports = router;