// model is usually singular of views
const mongoose = require('mongoose')

// Schema is like an sql database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Expot the schema with a new name Author
module.exports = mongoose.model('Author', authorSchema)