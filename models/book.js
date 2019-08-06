// model is usually singular of views
const mongoose = require('mongoose')


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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,
        ${this.coverImage.toString('base64')}`
    }
})

// Expot the schema with a new name Author
module.exports = mongoose.model('Book', bookSchema)
