const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createAt: 'desc'}).limit(10).exec()//descending order and limit to 10
  } catch {
    books = []//empty array
  }
  res.render('index', { books: books})
})

module.exports = router