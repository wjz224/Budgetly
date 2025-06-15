import React from "react";
import { Link } from "react-router-dom";
import classes from "../../css/Navbar.module.css"; // Import the CSS module

function Navbar() {
    return (
        <header className={classes.Navbar}>
            <Link to="/" className={classes.NavbarLogo}>
                <img src="/logoWhite.png" alt="Logo" className={classes.NavbarLogo} />
            </Link>
            <div className={classes.NavbarButtons}>
                <Link to="/login" className={classes.NavbarButton}>Login</Link>
                <Link to="/register" className={classes.NavbarButton}>Sign Up</Link>
            </div>
        </header>
    );
}

export default Navbar;