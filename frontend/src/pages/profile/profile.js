import React, { useEffect, useState } from 'react'
import './profile.scss'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch } from 'react-redux'
import { getUser } from '../../services/auth.service'
import { SET_NAME, SET_USER } from '../../redux/features/auth/auth.slice'
import { SpinnerImage } from '../../components/loader/loader'
import Card from '../../components/card/card'

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
        <div className="profile --my2">
            {isLoading && <SpinnerImage/>}
            <>
                {!isLoading && profile === null ? 
                ( <p>Something went wrong, please reload page...</p>) : 
                (<Card cardClass={"card --flex-dir-column"}>
                    <span className="profile-photo">
                        <img src={profile?.photo} alt="profilepic" />
                    </span>
                </Card>)}
            </>
        </div>
    )
}

export default Profile