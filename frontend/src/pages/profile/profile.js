import React, { useEffect, useState } from 'react'
import './profile.scss'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch } from 'react-redux'
import { getUser } from '../../services/auth.service'
import { SET_NAME, SET_USER } from '../../redux/features/auth/auth.slice'

const Profile = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch()

    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        async function getUserData() {
            const data = await getUser()
            console.log(data)

            setProfile(data)
            setIsLoading(false)
            await dispatch(SET_USER(data))
            await dispatch(SET_NAME(data.name))
        }
        getUserData()
    }, [dispatch])
    
    return (
        <div>Profile</div>
    )
}

export default Profile