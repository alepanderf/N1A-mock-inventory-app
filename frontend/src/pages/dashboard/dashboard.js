import React, { useEffect } from 'react'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../../redux/features/auth/auth.slice'
import { getProducts } from '../../redux/features/product/product.slice'
import ProductList from '../../components/product/productList/product.list'
import ProductSummary from '../../components/product/productSummary/product.summary'


const Dashboard = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch()

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {products, isLoading, isError, message} = useSelector((state) => state.product)

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getProducts())
        }

        if(isError) {
            console.log(message)
        }
    }, [isLoggedIn, isError, message, dispatch])


    return (
        <div>
            <ProductSummary products={products}/>
            <ProductList products={products} isLoading={isLoading}/>
        </div>
    )
}

export default Dashboard