const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')
const errorHandler = require('./middleware/error.middleware')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes Middleware
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)

// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})
// Error middleware
app.use(errorHandler)

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, (() => {
        console.log(`Server running on port ${PORT}`)
    }))
})
.catch((error) => console.log(error))