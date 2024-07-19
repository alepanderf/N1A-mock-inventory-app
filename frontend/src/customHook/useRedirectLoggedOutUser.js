import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getLoginstatus } from '../services/auth.service'
import { SET_LOGIN } from '../redux/features/auth/auth.slice'
import { toast } from 'react-toastify'

const useRedirectLoggedOutUser = (path) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const redirectLoggedOutUser = async() => {
            const isLoggedIn = await getLoginstatus()
            dispatch(SET_LOGIN(isLoggedIn))

            if(!isLoggedIn) {
                toast.info("Session expired, please log in to continue")
                navigate(path)
                return
            }
        }
        redirectLoggedOutUser()
    }, [navigate, path, dispatch])
}

export default useRedirectLoggedOutUser