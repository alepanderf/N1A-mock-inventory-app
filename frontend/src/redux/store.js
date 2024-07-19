import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../redux/features/auth/auth.slice"
import productReducer from "../redux/features/product/product.slice"
import filterReducer from '../redux/features/product/filter.slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        filter: filterReducer
    }
})