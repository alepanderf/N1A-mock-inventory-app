import React from 'react'
import Header from '../header/header'
import Footer from '../footer/footer'

const Layout = ({children}) => {
    return (
        <>
            <Header/>
                <div style={{minHeight: "80vh"}} className="--pad">
                    {children}
                </div>
            <Footer/>
        </>
    )
}

export default Layout