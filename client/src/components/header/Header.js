import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'

const Header = () => {

    return (
        <div className="header ">
            <nav className="navbar navbar-expand-lg justify-content-sm-between navbar-light 
            bg-light  align-middle">

                <Link to="/" className="logo">
                    <h1 className="navbar-brand"
                    onClick={() => window.scrollTo({top: 0})}>
                        𝓢𝓸𝓬𝓲𝓪𝓵
                    </h1>
                </Link>

                <Search />

                <Menu />
            </nav>
        </div>
    )
}

export default Header
