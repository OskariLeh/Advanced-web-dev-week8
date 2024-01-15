const mongoose = require("mongoose")

const Schema = mongoose.Schema

let todo = new Schema({
    user: {type: String},
    items: {type: Array}
})

module.exports = mongoose.model("todos", todo)