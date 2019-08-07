// model is usually singular of views
const mongoose = require('mongoose')
const Book = require('./book')

// Schema is like an sql database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//Only delete authors with no books
//Runs before remove method is used
authorSchema.pre('remove', function(next){
    Book.find({ author: this.id}, (err, books) =>{
        if (err) {
            next(err)
        } else if (books.length > 0){
            next(new Error('This author has books still'))
        } else {
            next()//Can remove the author
        }
    })
})

// Expot the schema with a new name Author
module.exports = mongoose.model('Author', authorSchema)