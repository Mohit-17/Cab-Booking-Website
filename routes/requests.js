const router = require('express').Router();
const Request = require('../models/Request-model');
const Client = require('../models/Client-model');
let errors = [];
router.get('/',(req,res) => { res.render('homepage1', {errors:errors,user:req.user}); });

router.post('/',(req,res) => {
    let errors = [];
    if(req.user) {
        Client.findOne({googleId:req.user.googleId}).then(usr => {
            if(!usr) {
                errors.push({msg:'Please sign in as a client for booking a ride'});
                res.render('homepage1',{errors:errors,user:req.user});
            } else {
                let contact = usr.contact,name = usr.name;
                const {Pick_Up,Drop,When} = req.body;
                const googleId = req.user.googleId;
                if(Pick_Up == '' || Drop == '' || When == ''){
                    errors.push({msg:'Please fill in all the details'});
                    res.render('homepage1',{errors:errors,user:req.user});
                } else {
                    if(Pick_Up.length < 3 || Drop.length < 3) {
                        errors.push({msg:'Please enter a valid Pick up and Drop Location'});
                        res.render('homepage1',{errors:errors,user:req.user});
                    } else {
                        const request = new Request({
                            Pick_Up,
                            Drop,
                            When,
                            name,
                            contact,
                            googleId
                        });
                        request.save().then(User => {
                            res.redirect('/register/client_dashboard');
                        });
                    }
                }
            }
        });
    } else {
        errors.push({msg:'Please first register/sign-in then book a ride'});
        res.render('homepage1',{errors:errors,user:req.user});   
    }

});
module.exports = router;