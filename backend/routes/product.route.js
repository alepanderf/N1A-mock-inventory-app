const express = require('express')
const protect = require('../middleware/auth.middleware')
const { createProduct, getProducts, getSingleProduct, deleteProduct, updateProduct } = require('../controllers/product.controller')
const router = express.Router()
const {upload} = require('../utils/file.upload')

router.post("/", protect, upload.single("image"), createProduct)
router.patch("/:id", protect, upload.single("image"), updateProduct)
router.get("/", protect, getProducts)
router.get("/:id", protect, getSingleProduct)
router.delete("/:id", protect, deleteProduct)


module.exports = router