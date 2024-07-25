import React, { useEffect } from 'react'
import './product.detail.scss'
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectIsLoggedIn } from '../../../redux/features/auth/auth.slice'
import { getProduct } from '../../../redux/features/product/product.slice'
import Card from '../../card/card'
import { SpinnerImage } from '../../loader/loader'

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
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ProductDetail