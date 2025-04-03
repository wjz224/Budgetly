import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"; // Import the new CSS file for the Navbar

function Navbar() {
    return (
        <header className="Navbar">
            <Link to="/"> {/* Wrap the logo in a Link */}
                <img src="/logoWhite.png" alt="Logo" className="NavbarLogo" />
            </Link>
            <div className="NavbarButtons">
                <Link to="/login" className="NavbarButton">Login</Link>
                <Link to="/register" className="NavbarButton">Sign Up</Link>
            </div>
        </header>
    );
}

export default Navbar;