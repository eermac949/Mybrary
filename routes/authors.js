const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')//regular expression that is case (i)nsensitive
    }
    try {
        const authors = await Author.find(searchOptions)//All authors so empty
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Author route(needs to be above /:id as it will recognize new as an id)
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() })
  })

// Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name//Name is required specifically for .name
    })
    try {
        const newAuthor = await author.save()//asynchronous wait for author.save then newAuthor is assigned
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req,res) => {
    try {
        const author = await Author.findById(req.params.id)
        //execute this function and put the result in constant books
        const books = await Book.find({ author: author.id}).limit(6).exec()//an author can have 100's of books
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author })
    } catch{
        res.redirect('/authors')
    }
    
})

router.put('/:id', async (req,res) => {
    let author// set author inside try need it locally in try and catach
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name// Set the new name before we save it
        await author.save()//asynchronous wait for author.save then newAuthor is assigned
        res.redirect(`/authors/${author.id}`)//without / means its relative
    } catch {
        if (author == null) {
            res.redirect('/')//redirect to homepage when no author
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req,res) => {
    let author// set author inside try need it locally in try and catach
    try {
        author = await Author.findById(req.params.id)
        await author.remove()//asynchronous wait for delete
        res.redirect('/authors')//without / means its relative
    } catch {
        if (author == null) {
            res.redirect('/')//redirect to homepage when no author
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router