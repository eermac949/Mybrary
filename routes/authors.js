const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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

// New Author route
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
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router