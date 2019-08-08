const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']//Types of image files the server accepts


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
        //console.log('error')
    }
})

// New Book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
  })

// Create Book Route
//single file of name cover
router.post('/', async (req, res) => {
    //We set it to null so we can get an error when they haven't uploaded one
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //Convert into date from string using Date function
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        renderNewPage(res, book, true)//pass existing book and true for error
        //console.log('error')
    }
})

//Show Book Route
router.get('/:id', async (req,res) => {
    try {
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec()
//pupolate author variable with all the information(object info)
        res.render('books/show', {book:book})
    } catch  {
        res.redirect('/')
        //console.log('error')
    }
})

//Edit book route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        //console.log('error')
        res.redirect('/')
    }
  })

  //Update Book Route
  router.put('/:id', async (req, res) => {
    //We set it to null so we can get an error when they haven't uploaded one
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch /*(err)*/ {
        //console.log(err)//Detailed Error message code
        if (book != null) {
            renderEditPage(res, book, true)//pass existing book and true for error
        } else {
            //console.log('error')
            redirect('/')
        }
        
    }
})

router.delete('/:id', async (req,res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

//Default set hasError to false
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

//For duplication
async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})//get all authors
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch{
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded){
    if (coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    // check if there is a cover and its the correct file type
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')//Convert the buffer from base64
        book.coverImageType = cover.type
    }
}

module.exports = router