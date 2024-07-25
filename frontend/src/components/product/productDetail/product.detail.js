import React, { useEffect } from 'react'
import './product.detail.scss'
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectIsLoggedIn } from '../../../redux/features/auth/auth.slice'
import { getProduct } from '../../../redux/features/product/product.slice'
import Card from '../../card/card'

const ProductDetail = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch()

    const {id} = useParams()

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {product, isLoading, isError, message} = useSelector((state) => state.product)

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getProduct(id))
            console.log(product)
        }

        if(isError) {
            console.log(message)
        }
    }, [isLoggedIn, isError, message, dispatch, product])

    return (
        <div className="product-detail">
            <h3 className="--mt">Product Details</h3>
            <Card cardClass="card">

            </Card>
        </div>
    )
}

export default ProductDetail