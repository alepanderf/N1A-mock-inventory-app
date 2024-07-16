const asyncHandler = require('express-async-handler')
const Product = require('../models/product.model')
const { fileSizeFormatter } = require('../utils/file.upload')
const cloudinary = require('cloudinary').v2

//Create product
const createProduct = asyncHandler (async (req, res) => {
    const {name, sku, category, quantity, price, description} = req.body

    //validation
    if(!name || !category || !quantity || !price ||!description) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }

    //Handle Image upload
    let fileData = {}
    if (req.file) {
        //Save image to cloudinary
        let uploadedFile
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "N1A-Image-Inventory", resource_type: "image"})
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalName,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    //Create Product
    const product = await Product.create({
        user: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    })

    res.status(201).json(product)
})

// Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({user: req.user.id}).sort("-createdAt")
    res.status(200).json(products)
})

// Get a single product
const getSingleProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) { //if product doesnt exist
        res.status(404)
        throw new Error("Product not found")
    }

    if (product.user.toString() !== req.user.id) { //if product isnt in user's profile
        res.status(401)
        throw new Error("User not authorized")
    }
    res.status(200).json(product)
})

//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) { //if product doesnt exist
        res.status(404)
        throw new Error("Product not found")
    }

    if (product.user.toString() !== req.user.id) { //if product isnt in user's profile
        res.status(401)
        throw new Error("User not authorized")
    }
    await product.deleteOne();
    res.status(200).json({message: "Product deleted"})
})

//Update product
const updateProduct = asyncHandler (async (req, res) => {
    const {name, category, quantity, price, description} = req.body
    const {id} = req.params

    const product = await Product.findById(id)

    if (!product) { //if product doesnt exist
        res.status(404)
        throw new Error("Product not found")
    }
    if (product.user.toString() !== req.user.id) { //if product isnt in user's profile
        res.status(401)
        throw new Error("User not authorized")
    }

    //Handle Image upload
    let fileData = {}
    if (req.file) {
        //Save image to cloudinary
        let uploadedFile
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "N1A-Image-Inventory", resource_type: "image"})
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalName,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    //Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id: id},
        {
            name,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ? product.image : fileData
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedProduct)
})

module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
}