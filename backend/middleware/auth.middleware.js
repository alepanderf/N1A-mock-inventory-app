const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const protect = asyncHandler( async(req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token) {
            res.status(401)
            throw new Error("Not authorized. Please log in")
        }

        // Validate token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //get user from token
        const user = await User.findById(verified.id).select("-password")
        
        if(!user){
            res.status(401)
            throw new Error("User not found")
        }
        req.user = user
        next()
    }
    catch (error) {
        res.status(401)
        throw new Error("Not authorized. Please log in")
    }
})

module.exports = protect