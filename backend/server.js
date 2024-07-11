const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, (() => {
        console.log(`Server running on port ${PORT}`)
    }))
})
.catch((error) => console.log(error))