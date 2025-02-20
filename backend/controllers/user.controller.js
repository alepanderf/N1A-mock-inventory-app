const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Token = require('../models/token.model')
const crypto = require('crypto')
const sendEmail = require ('../utils/send.email')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

//Register User
const registerUser = asyncHandler( async(req, res) => {
    const {name, email, password} = req.body

    //validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }

    if(password.length < 8){
        res.status(400)
        throw new Error("Password must be at least 8 characters")
    }

    //check if user email exists in database
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error("Email has already been registered")
    }

    //create new user
    const user = await User.create({
        name,
        email,
        password
    })

    //Generate token
    const token = generateToken(user._id)

    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),   // expires in 1 day
        sameSite: "None",
        secure: true //uses HTTPS
    })

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//Log user in
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    //validate request
    if(!email || !password) {
        res.status(400)
        throw new Error("Please add an email and password")
    }

    //check if user exists in database
    const user = await User.findOne({email})
    if(!user) {
        res.status(400)
        throw new Error("User not found, please register")
    }

    //user exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    //Generate token
    const token = generateToken(user._id)

    if(passwordIsCorrect){
    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),   // expires in 1 day
        sameSite: "None",
        secure: true //uses HTTPS
    })}

    if(user && passwordIsCorrect){
        const {_id, name, email, photo, phone, bio} = user
        res.status(200).json({
            _id, name, email, photo, phone, bio, token
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid email or password")
    }
})

//Logout User
const logout = asyncHandler(async(req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "None",
        secure: true //uses HTTPS
    })
    return res.status(200).json({message: "Successfully logged out"})
})

//Get User profile

const getUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(200).json({
            _id, name, email, photo, phone, bio
        })
    } else {
        res.status(400)
        throw new Error("User not found")
    }
})

// Get login status
const loginStatus = asyncHandler (async (req, res) =>{
    const token = req.cookies.token
    if(!token){
        return res.json(false)
    }

    // Validate token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(verified){
        return res.json(true)
    }
    return res.json(false)

})

// Update User
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        user.email = email
        user.name = req.body.name || name
        user.photo = req.body.photo || photo
        user.phone = req.body.phone || phone
        user.bio = req.body.bio || bio  

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id, 
            name: updatedUser.name, 
            email: updatedUser.email,
            photo: updatedUser.photo, 
            phone: updatedUser.phone, 
            bio: updatedUser.bio
        })
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})

//Change Password
const changePassword = asyncHandler( async(req, res) => {
    const user = await User.findById(req.user._id)
    const{oldPassword, password} = req.body

    if (!user) {
        res.status(400)
        throw new Error("User not found, please sign up")
    }
    //validate all boxes are fulfilled
    if (!oldPassword || !password) {
        res.status(400)
        throw new Error("Please enter old and new password")
    }

    //check that password matches existing password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)
    
    //save new password
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password change successful")
    } else {
        res.status(400)
        throw new Error("The old password is incorrect")
    }
})

//Forgot password
const forgotPassword = asyncHandler ( async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if (!user) {
        res.status(404) 
        throw new Error("User does not exist")
    }

    //Delete token if it exists in the DB
    let token = await Token.findOne({userId: user._id})

    if (token) {
        await token.deleteOne()
    }
    
    //create  reset-password token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id
    console.log(resetToken)

    // Hash token before saving to DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    
    //save token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) //thirty minutes
    }).save()

    //construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset Email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This reset link will work for 30 minutes</p>

        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Peace</p>  `

    const subject = "Password Reset Request"
    const send_to = user.email
    const sent_from = process.env.EMAIL_USER
    
    try {
        await sendEmail(subject, message, send_to, sent_from)
        res.status(200).json({success: true, message: "Reset email sent"})
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please try again")
    }
})

// Reset Password

const resetPassword =  asyncHandler (async (req, res) => {
    
    const {password} = req.body
    const {resetToken} = req.params

    //Hash token, then compare to exisitng hashed token in DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    //Find token in DB
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
    })

    if (!userToken) {
        res.status(404)
        throw new Error("Invalid or expires token")
    }

    //Find user
    const user = await User.findOne({_id: userToken.userId})
    user.password = password
    await user.save()
    res.status(200).json({message: "Password reset successful, please login"})
})

module.exports = { 
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
}