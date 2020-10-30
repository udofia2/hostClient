const mongoose = require('mongoose')

const { Schema } = mongoose

const domain = new Schema({
  name: {
    type: String,
    unique: true
  }
})

module.exports = mongoose.model('domains', domain)