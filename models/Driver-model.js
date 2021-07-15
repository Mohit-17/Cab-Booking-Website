const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    contact: { 
        type : Number,
        required:true
    },
    type:{
        type: String,
        required:true
    },
    googleId: {
        type: String,
        required:true
    },
    address: {
        type:String,
        required:true
    }
});

const Driver = mongoose.model('driver',userSchema);

module.exports = Driver;