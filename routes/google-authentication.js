const router = require('express').Router();
const passport = require('passport');

router.get('/',(req,res) => { res.render('login') });

router.get('/google',passport.authenticate('google', {
    scope: ['profile']
})); 

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    // res.send(req.user);
    res.redirect('/register/details');
});