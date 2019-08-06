// model is usually singular of views
const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

// Schema is like an sql database
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now//Sets the date to current date so don't have to set
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: { //need to reference author from 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'//Author name must match name used for model
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    //Use normal function to have access to this. property
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// Expot the schema with a new name Author
module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath