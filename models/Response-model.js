const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Pick_Up: {
        type:String,
        required:true
    },
    Drop: {
        type:String,
        required:true
    },
    When: {
        type:Date,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    contact: {
        type:Number,
        required:true
    },
    googleId: {
        type:Number,
        required:true
    },
    driver_name: {
        type:String,
        required:true
    },
    driver_contact: {
        type:Number,
        required:true
    },
    client_googleId: {
        type: String,
        required:true
    }
});

const Response = mongoose.model('Response',userSchema);

module.exports = Response;