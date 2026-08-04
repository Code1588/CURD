const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({

    email:String,

    password:String,

    name:String,

    image:String

});

module.exports = mongoose.model("image",imageSchema);