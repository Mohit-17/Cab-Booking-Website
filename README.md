# Cab-Booking-Website
This Website allows clients to request a ride by specifying his/her current location and destination which the Drivers can see and accept/reject requests for the same.

Requirements
1.'ClientID' and 'ClientSecret' -- Should be created through Google Developer Console for using Google OAuth 2.0 Consent Screen.
2.MongoDB account required for Database operations. dbURI will be required .
3.Latest version of Node.Js

Steps for implementing this project
1.Paste your 'ClientID' and 'ClientSecret' and 'dbURI' in keys.js file present in config folder of main directory.
2.Enter cookieKey in keys.js file.(Any random good name would do).
3.Run npm install to install all the dependencies present in package.json file
4.Run nodemon app.js to start the server file, now you can view the website at https://localhost:5000
