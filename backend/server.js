const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/user.route')

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes Middleware
app.use("/api/users", userRoute)

// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})


const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, (() => {
        console.log(`Server running on port ${PORT}`)
    }))
})
.catch((error) => console.log(error))