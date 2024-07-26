import React, { useEffect } from 'react'
import './product.detail.scss'
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectIsLoggedIn } from '../../../redux/features/auth/auth.slice'
import { getProduct } from '../../../redux/features/product/product.slice'
import Card from '../../card/card'
import { SpinnerImage } from '../../loader/loader'
import DOMPurify from "dompurify"

const ProductDetail = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch()

    const { id } = useParams()

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {product, isLoading, isError, message} = useSelector((state) => state.product)

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getProduct(id))
        }

        if(isError) {
            console.log(message)
        }
    }, [isLoggedIn, isError, message, dispatch])

    const stockStatus = (quantity) => {
        if (quantity > 0) {
            return <span className="--color-success">In Stock</span>
        }
        return <span className="--color-danger">Out of Stock</span>
    }

    return (
        <div className="product-detail">
            <h3 className="--mt">Product Details</h3>
            <Card cardClass="card">
                {isLoading && <SpinnerImage/>}
                {product && (
                    <div className="detail">
                        <Card cardClass="group">
                            {product?.image ? (
                                <im src={product.image.filePath} alt={product.image.fileName} />
                            ) : (
                                <p>No image set for this product</p>
                            )}
                        </Card>
                        <h4>Product Availability: {stockStatus(product.quantity)}</h4>
                        <hr />
                        <h4>
                            <span className="badge">Name: </span> &nbsp; {product.name}
                        </h4>
                            <p>
                                <b>&rarr; SKU :</b> {product.sku}
                            </p>
                            <p>
                                <b>&rarr; Category :</b> {product.category}
                            </p>
                            <p>
                                <b>&rarr; Price :</b> {product.price}
                            </p>
                            <p>
                                <b>&rarr; Quantity in Stock :</b> {"$"}{product.quantity}
                            </p>
                            <p>
                                <b>&rarr; Total Value in Stock :</b> {"$"}{product.price * product.sku}
                            </p>
                            <hr />
                            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.description)}}></div>
                            <hr />
                            <code className="--color-dark">Created on: {product.createdAt.toLocaleString("en-US")} </code>
                            <br/>
                            <code className="--color-dark">Last updated: {product.updatedAt.toLocaleString("en-US")} </code>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ProductDetail