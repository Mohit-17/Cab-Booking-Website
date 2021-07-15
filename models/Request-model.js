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
        type: String,
        required:true
    }
});

const Request = mongoose.model('request',userSchema);

module.exports = Request;