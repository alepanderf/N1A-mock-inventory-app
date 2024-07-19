import React from 'react'
import { BsDatabaseFillGear } from "react-icons/bs"
import { Link } from 'react-router-dom'
import './home.scss'
import heroImg from '../../assets/inv-img.png'
import { ShowOnLogin, ShowOnLogout } from '../../components/protect/hidden.links'

const Home = () => {
    return(
        <div className="home">
            <nav className="container --flex-between">
                <div className="logo">
                    <BsDatabaseFillGear size={35} />
                </div>
                <ul className="home-links">
                    <ShowOnLogout>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </ShowOnLogout>
                    <ShowOnLogout>
                        <li>
                            <button className="--btn --btn-primary">
                                <Link to="/login">Login</Link>
                            </button>     
                        </li>
                    </ShowOnLogout>
                    <ShowOnLogin>
                        <li>
                            <button className="--btn --btn-primary">
                                <Link to="/dashboard">Dashboard</Link>
                            </button>
                        </li>
                    </ShowOnLogin>
                </ul>
            </nav>
            {/* Hero Section*/}
            <section className="container hero">
                <div className="hero-text">
                    <h2>
                        Inventory & Stock Management Solution
                    </h2>
                    <p>
                        Inventory web application to manage products in the N1A Warehouse in real time and store information about products securely
                    </p>
                    <div className="hero-buttons">
                        <button className="--btn --btn-secondary">
                            <Link to="/dashboard">Free Trial 1 Month</Link>
                        </button>
                    </div>
                    <div className="--flex-start">
                        <NumberText num="Mock Inventory" text="LGE Intern Project"/>
                        <NumberText num="Beta" text="Personal Project"/>
                        <NumberText num="1" text="actively used business"/>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={heroImg} alt="Inventory"/>
                </div>
            </section>
        </div>
    )
}

const NumberText = ({num, text}) => {
    return(
        <div className="--mr">
            <h3 className="--color-white">{num}</h3>
            <p className="--color-white">{text}</p>
        </div>
    )
} 

export default Home