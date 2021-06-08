const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    author : {
        type : String
    },
    uid : {
        type : String
    },
    date : {
        type : Date,
        default : new Date()
    }
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;