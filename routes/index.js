const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    // res.send('Hello World - Kappa') Sends basic text
    res.render('index.ejs')
})

module.exports = router//Need to export to Server