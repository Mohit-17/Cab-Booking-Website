const router = require('express').Router();
const Client = require('../models/Client-model');
const Driver = require('../models/Driver-model');
const Request = require('../models/Request-model');
const Response = require('../models/Response-model');

let array = [];

const authCheck = (req,res,next) => {
    if(!req.user){
        //if user is not logged in
        res.redirect('/auth/login');
    } else {
        //if logged in
        next();
    }
};

// db.findOne({key:value});

router.get('/profile',authCheck,(req,res) => {
    Client.findOne({googleId:req.user.googleId}).then(User => {
        if(User){
            res.render('client_profile',{username:User.name,contact:User.contact,address:User.address});
        } else {
            Driver.findOne({googleId:req.user.googleId}).then(User => {
                res.render('driver_profile',{username:User.name,contact:User.contact,type:User.type,address:User.address})
            });
        }
    });
});

router.get('/driver_dashboard',authCheck,(req,res) => {
    let array = [],responses = [];
    Request.find({},function(err,users){
        let contact1,name1,Pick_Up1,Drop1,When1,id1;
        users.forEach(function(user){  
            Pick_Up1 = user.Pick_Up;
            Drop1 = user.Drop;
            When1 = user.When;
            name1 = user.name;
            contact1 = user.contact;
            id1 = user._id;
            let details = {id:id1,Pick_Up:Pick_Up1,Drop:Drop1,When:When1,contact:contact1,name:name1};
            array.push(details);
        });

        Response.find({googleId:req.user.googleId},function(err,users){
            let contact,name,Pick_Up,Drop,When,id;
            users.forEach(function(user){
                Pick_Up = user.Pick_Up;
                Drop = user.Drop;
                When = user.When;
                name = user.name;
                contact = user.contact;
                id = user._id;
                let details = {id:id,Pick_Up:Pick_Up,Drop:Drop,When:When,contact:contact,name:name};
                responses.push(details);
            });
            res.render('driver_dash (1)',{array:array,responses:responses});
        });
    });
    
});

router.get('/client_dashboard',(req,res) => {
    let array = [],responses = [];
    Request.find({googleId:req.user.googleId},function(err,users){
        let contact1,name1,Pick_Up1,Drop1,When1,id1;
        users.forEach(function(user){  
            Pick_Up1 = user.Pick_Up;
            Drop1 = user.Drop;
            When1 = user.When;
            name1 = user.name;
            contact1 = user.contact;
            id1 = user._id;
            let details = {id:id1,Pick_Up:Pick_Up1,Drop:Drop1,When:When1,contact:contact1,name:name1};
            array.push(details);
        });
        
        Response.find({client_googleId:req.user.googleId},function(err,users){
            let contact,name,Pick_Up,Drop,When,id;
            users.forEach(function(user){
                Pick_Up = user.Pick_Up;
                Drop = user.Drop;
                When = user.When;
                name = user.driver_name;
                contact = user.driver_contact;
                id = user._id;
                let details = {id:id,Pick_Up:Pick_Up,Drop:Drop,When:When,contact:contact,name:name};
                responses.push(details);
            });
            res.render('client_dash',{array:array,responses:responses});
        });
    });
});

router.post('/client_dashboard',(req,res) => {
    if(req.body){
        Request.findOneAndDelete({_id:req.body.id}).then(usr => {
            // console.log(usr);
        }); 
    }
});

router.post('/driver_dashboard',(req,res) => {
    if(req.body){
        let array = [],responses = [];
        let Pick_Up = req.body.Pick_Up;
        let Drop = req.body.Drop;
        let When = req.body.When;
        let contact = req.body.contact;
        let name = req.body.name;
        let googleId = req.user.googleId;
        Driver.findOne({googleId:req.user.googleId}).then(users => {
            if(users){
                Request.findOneAndDelete({_id:req.body.id}).then(user => {
                    let client_googleId = user.googleId;
                    let driver_name,driver_contact;
                    driver_name = users.name;
                    driver_contact = users.contact;
                    const response = new Response({
                        Pick_Up,
                        Drop,
                        When,
                        contact,
                        name,
                        googleId,
                        client_googleId,
                        driver_name,
                        driver_contact
                    });
                    response.save();
                });
                Request.find({googleId:req.user.googleId},function(err,users){
                    let array = [];
                    let responses = [];
                    let contact,name,Pick_Up,Drop,When,id;
                    users.forEach(function(user){  
                        Pick_Up = user.Pick_Up;
                        Drop = user.Drop;
                        When = user.When;
                        name = user.name;
                        contact = user.contact;
                        id = user._id;
                        let details = {id:id,Pick_Up:Pick_Up,Drop:Drop,When:When,contact:contact,name:name};
                        array.push(details);
                    });
                }).then(Response.find({googleId:req.user.googleId},function(err,users){
                    let contact,name,Pick_Up,Drop,When,id;
                    users.forEach(function(user){
                        Pick_Up = user.Pick_Up;
                        Drop = user.Drop;
                        When = user.When;
                        name = user.name;
                        contact = user.contact;
                        id = user._id;
                        let details = {id:id,Pick_Up:Pick_Up,Drop:Drop,When:When,contact:contact,name:name};
                        responses.push(details);
                        res.render('driver_dash (1)',{array:array,responses:responses});
                    });
                }));
            }
        });
    }
})

router.get('/',(req,res) => { res.render('login',{ array:array }) } );

router.get('/login',(req,res) => {
    if (req.user) {
        let googleId = req.user.googleId;
        Client.findOne({googleId:googleId}).then(user => {
            if(user) {
                res.redirect('/profile');
            } else {
                Driver.findOne({googleId:googleId}).then(user => {
                    if(user) {
                        res.redirect('/profile');
                    }
                });
            }
        });
    }  
    else {
        res.render('login'); 
    }
});
// before showing register page, we check whether the client or driver already has as account, if yes redirect to their profile page 
router.get('/details',(req,res) => { 
    if(req.user){
        Client.findOne({googleId:req.user.googleId}).then(User => {
            if(User){
                res.redirect('/profile');
            } else {
                Driver.findOne({googleId:req.user.googleId}).then(User => {
                    if(User){
                        res.redirect('/profile');
                    } else {
                        res.render('register_cab', {array:array} );
                    }
                });
            }
        });
    } else {
        res.redirect('/register');     // if user is not logged in, then redirect to login page
    } 
});

//auth logout
router.get('/logout', (req,res) => {
    //hande with passport 
    req.logOut();
});


router.post('/details',(req,res) => {
    const { name,contact } = req.body;
    let array = [];
    // const {name, contact_no } = req.body;
    if( (name == '') || (contact == '') ){
        array.push({msg:'Please enter all details'});   
    }
    if(array.length > 0) {
        return res.render('register_cab', {array:array});
    } else {
        if(req.body.As == null) {
            array.push({msg: 'Please tell whether you are client or driver'});
            return res.render('register_cab',{array:array, name:name,contact:contact});
        }
        if(req.body.As == 'on') { 
            const { name,contact,address } = req.body;
            const googleId = req.user.googleId;
            const client = new Client({
                name,
                contact, 
                googleId,
                address
            });
            Client.findOne({ name:name }).then(user => {
                if(user) {
                    if( (user.googleId == googleId) && (user.contact == contact) ){
                        return res.redirect('/');
                    } else {
                        array.push({msg: 'Please enter a unique username'});
                        return res.render('register_cab',{array:array}); 
                    }
                }
                if(contact.length != 10) {
                    array.push({msg:'Please enter a valid contact no'});
                    return res.render('register_cab',{array:array});
                }
                client.save().then(user => {
                    return res.redirect('/profile');
                }).catch(err => console.log(err));
            });
        }  
        else if(req.body.As == 'off') {
            const { name,contact,type,address } = req.body;
            //Store driver details in Driver-model
            const googleId = req.user.googleId;
            const driver = new Driver({
                name,
                contact,
                type,
                googleId,
                address
            });
            if(req.body.type == null){
                array.push({msg: 'Please enter your Cab Type'});
                return res.render('register_cab',{array:array});
            }
            Driver.findOne({name:name}).then(user => {
                if(user) {
                    if( (user.googleId == googleId) && (user.contact == contact) && type == user.type){
                        return res.redirect('/');
                    } else {
                        array.push({msg: 'Please enter a unique username'});
                        return res.render('register_cab',{array:array}); 
                    }
                }
                if(contact.length != 10) {
                    array.push({msg:'Please enter a valid contact no'});
                    return res.render('register_cab',{array:array});
                }
                driver.save().then(user => {
                    return res.redirect('/profile');
                }).catch(err => console.log(err));
            })
        }
    }
});

module.exports = router;


