import React, { useState } from 'react'
import './profile.scss'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/auth/auth.slice'
import Loader from '../../components/loader/loader'
import { Link } from 'react-router-dom'
import Card from '../../components/card/card'

const EditProfile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(selectUser)
    
    const inititalState = {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        bio: user?.bio,
        photo: user?.photo,
    }
    
    const [profile, setProfile] = useState(initialState)
    const [profileImage, setProfileImage] = useState("")

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setProfile({ ...profile, [name]: value})
    }

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0])
    }

    const saveProfile = (e) => {
        e.preventDefault()
    }

    return(
        <div className="profile --my2">
            {isLoading && <Loader />}

            <Card cardClass={"card --flex-dir-column"}>
                    <span className="profile-photo">
                        <img src={user?.photo} alt="profilepic" />
                    </span>
                    <form className="--form-control" onSubmit={saveProfile}>
                        <span className="profile-data">
                            <p>
                                <label>Name: </label>
                                <input type="text" name="name" value={profile?.name} onChange={handleInputChange}/>
                            </p>
                            <p>
                                <label>Email: </label>
                                <input type="text" name="email" value={profile?.email} disabled/>
                                <br/>
                                <code>Email cannot be changed.</code>
                            </p>
                            <p>
                                <label>Phone: </label>
                                <input type="text" name="phone" value={profile?.phone} onChange={handleInputChange}/>
                            </p>
                            <p>
                                <label>Bio: </label>
                                <textarea name="bio" value={profile?.bio} onChange={handleInputChange} cols="30" rows="10"></textarea>
                            </p>
                            <p>
                                <label>Photo: </label>
                                <input type="file" name="image" onChange={handleImageChange}/>
                            </p>
                            <div>
                                <button className="--btn --btn-primary">Edit Profile</button>
                            </div>
                        </span>
                    </form>
                </Card>
        </div>
    )
}

export default EditProfile