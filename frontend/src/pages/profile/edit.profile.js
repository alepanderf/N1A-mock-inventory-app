import React, { useEffect, useState } from 'react'
import './profile.scss'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/auth/auth.slice'
import Loader from '../../components/loader/loader'
import Card from '../../components/card/card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateUser } from '../../services/auth.service'

const EditProfile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(selectUser)
    const {email} = user 
    const navigate = useNavigate()

    useEffect(() => {
        if (!email) {
            navigate("/profile")
        }
    }, [email, navigate])
    
    const initialState = {
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

    const saveProfile = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            let imageURL
            if (profileImage && 
                (
                    profileImage.type === "image/jpeg" ||
                    profileImage.type === "image/jpg" ||
                    profileImage.type === "image/png"
                ))
                {
                    const image = new FormData()
                    image.append("file", profileImage)
                    image.append("cloud_name", "dbcugeiur")
                    image.append("upload_preset", "xe3yhbyl")

                    //first save image to cloudinary
                    const response = await fetch("https://api.cloudinary.com/v1_1/dbcugeiur/image/upload", {method: "post", body: image})
                    const imgData = await response.json()
                    const imageURL = imgData.url.toString()
                }

                    //save profile
                    const formData = {
                        name: profile.name,
                        phone: profile.phone,
                        bio: profile.bio,
                        photo: profileImage ? imageURL : profile.photo
                    }

                    const data = await updateUser(formData)
                    console.log(data)
                    toast.success("User updated")
                    navigate("/profile")
                
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            toast.error(error.message)
        }
    }

    return(
        <div className="profile --my2">
            {isLoading && <Loader />}

            <Card cardClass={"card --flex-dir-column"}>
                    <span className="profile-photo">
                        <img src={user?.photo} alt="profilepic" />
                    </span>
                    <form className="--form-control --m" onSubmit={saveProfile}>
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