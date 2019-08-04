//In our packages.json file we use nodemon for live changes with devStart

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')// ./ relative to current location

app.set('view engine', 'ejs')//Our display language
app.set('views', __dirname +'/views')//changing the dir for the ejs files
app.set('layout', 'layouts/layout')//every file that placed in layout 
//file is to keep layouts for replication later
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')//import mongoose
//Using.env need to use npm env dev thing
mongoose.connect(process.env.DATABASE_URL, {
    useNewURLParser: true})//Mongoose uses old method from mongoDB
    const db = mongoose.connection
    db.on('error', error => console.error(error))
    db.once('open', () => console.log('Connected to Mongoose'))
    //never hardcode connection. 
//Dependent on environment. Want to connect to 
//{these are the options to setup mongoDB}

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)//Pulls from process environment on port..

