const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')//file system library included in node.js
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)//Joins two paths
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']//Types of image files the server accepts
const upload = multer({
    dest: uploadPath, //dest= destination (upload path)
    fileFilter: (req, file, callback) => {// allows to filter what files server accepts
        callback(null, imageMimeTypes.includes(file.mimetype))//null is the error parameter
    }
})

// All Books Route
router.get('/', async (req, res) => {
    //Search logic for books
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i')) //regex??
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore) //lessthan or equal to(lte)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter) //greaterthan or equal to(lte)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
  })

// Create Book Route
//single file of name cover
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null//set filename if it exists
    //We set it to null so we can get an error when they haven't uploaded one
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //Convert into date from string using Date function
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        if (book.coverImageName != null){
        removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)//pass existing book and true for error
    }
})

function removeBookcover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

//Default set hasError to false
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})//get all authors
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch{
        res.redirect('/books')
    }
}

module.exports = router