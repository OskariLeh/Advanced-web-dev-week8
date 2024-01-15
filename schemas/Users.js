const mongoose = require("mongoose")

const Schema = mongoose.Schema

let user = new Schema({
    email: {type: String},
    password: {type: String}
})

module.exports = mongoose.model("users", user)