const express = require('express');
const register = require('./routes/initial-registration');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');
const app = express();
const cookieSession = require('cookie-session');
const path = require('path');
const keys = require('./config/keys');
const port = process.env.PORT || 5000;
const flash = require('connect-flash');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passport = require('passport');
const req = require('./routes/requests');

//Connect to MongoDB
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true }, () => {
    console.log('connected to mongodb');
});

app.use(cookieSession({
    maxAge:24 * 60 * 60 * 1000,
    keys:[keys.session.cookieKey]
}));



// Connect flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  

// Require static assets from public folder
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname + '/public')))

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Express body parser
app.use(express.urlencoded({ extended: true }));

//Set view engine
app.set('view engine','ejs');

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up routes
app.use('/register',register);  

app.use('/auth',authRoutes);   
app.use('/profile',profileRoutes); 

app.use(req);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
