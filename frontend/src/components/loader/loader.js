import React from 'react'
import loaderImg from '../../assets/loader.gif'
import ReactDOM from 'react-dom'
import './loader.scss'

const Loader = () => {
    return ReactDOM.createPortal(
        <div className="wrapper">
            <div className="loader">
                <img src={loaderImg} alt="Loading..."/>
            </div>
        </div>,
        document.getElementById("loader")
    )
}

export const SpinnerImage = () => {
    return(
        <div className="--center-all">
            <img src={loaderImg} alt="Loading..."/>
        </div>
    )
}

export default Loader