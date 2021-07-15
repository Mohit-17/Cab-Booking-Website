const router = require('express').Router();
const Client = require('../models/Client-model');
const Driver = require('../models/Driver-model');
const Request = require('../models/Request-model');
const Response = require('../models/Response-model');
const Users = require('../models/user-model');

const authCheck = (req, res, next) => {
    if (!req.user) {
        //if user is not logged in
        res.redirect('/auth/login');
    } else {
        //if logged in
        next();
    }
};
//    /profile/delete_account
router.post('/delete_account',(req,res) => {
    Client.deleteOne({googleId:req.user.googleId}).then(user1 => {
        Request.deleteMany({googleId:req.user.googleId}).then(user2 => {
            Response.deleteMany({googleId:req.user.googleId}).then(user3 => {
                Users.deleteOne({googleId:req.user.googleId}).then(user4 =>{
                    Users.deleteOne({googleId:req.user.googleId}).then(user5 => {
                        Driver.deleteMany({googleId:req.user.googleId}).then(user6 => {
                            Response.deleteMany({googleId:req.user.googleId}).then(user6 => {   
                                res.redirect('/auth/logout');
                            });
                        })
                    });
                });
            });
        });
    });
})


router.post('/', authCheck, (req, res) => {
    Client.findOne({ googleId: req.user.googleId }).then(User1 => {
        if (User1) {
            const { usr, num, address } = req.body;
            User1.name = usr;
            User1.contact = num;
            User1.address = address;
            User1.save();
            res.redirect('/profile');
        } else {
            Driver.findOne({ googleId: req.user.googleId }).then(User2 => {
                if (User2) {
                    const {usr,num,address,check} = req.body;
                    User2.name = usr;
                    User2.contact = num;
                    User2.address = address;
                    if(check){
                        User2.type = check;
                    }
                    User2.save();
                    res.redirect('/profile'); 
                }
            })
        }
    });
});


router.get('/', authCheck, (req, res) => {
    Client.findOne({ googleId: req.user.googleId }).then(User => {
        if (User) {
            res.render('client_profile', { username: User.name, contact: User.contact, address: User.address });
        } else {
            Driver.findOne({ googleId: req.user.googleId }).then(User => {
                res.render('driver_profile', { username: User.name, contact: User.contact, type: User.type, address: User.address })
            });
        }
    });
});


module.exports = router;