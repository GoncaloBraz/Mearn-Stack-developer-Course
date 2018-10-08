const express = require('express')
const mongoose = require('mongoose')

const app = express()

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
    .connect(db)
    .then( () => {
        console.log('MongoDB Connected')
    })
    .catch(err => {
        console.log(err)
    })

app.get('/', (req, res, next) => {
    res.send('Hello')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('server running on port' + port)
})

