import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDashboard, MdAttachMoney, MdBarChart, MdChat, MdSettings, MdAccountCircle } from 'react-icons/md';
import classes from '../../css/Dashboard.module.css';
import { useAuth } from '../Authentication/utils/AuthContext';

function Sidebar({ onSignOut }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const iconRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleUserIconClick = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        if (!showDropdown) return;
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleSignOut = async () => {
        await logout();
        navigate('/');
    };

    return (
        <aside className={classes["dashboard-sidebar"]}>
            <div ref={iconRef} className={classes["user-icon-container"]} onClick={handleUserIconClick}>
                <MdAccountCircle className={classes["user-icon"]} />
                {showDropdown && (
                    <div ref={dropdownRef} className={classes["user-dropdown"]}>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>
                )}
            </div>

            <nav>
                <ul className={classes["dashboard-nav-list"]}>
                    <li className={classes["dashboard-nav-item"]}>
                        <Link to="/dashboard" className={classes["dashboard-link"]}>
                            <MdDashboard className={classes["dashboard-icon"]} /> Home
                        </Link>
                    </li>
                    <li className={classes["dashboard-nav-item"]}>
                        <Link to="/budgets" className={classes["dashboard-link"]}>
                            <MdDashboard className={classes["dashboard-icon"]} /> Budgets
                        </Link>
                    </li>
                    <li className={classes["dashboard-nav-item"]}>
                        <MdBarChart className={classes["dashboard-icon"]} /> Reports
                    </li>
                    <li className={classes["dashboard-nav-item"]}>
                        <MdChat className={classes["dashboard-icon"]} /> Chat with BudgetAI
                    </li>
                    <li className={classes["dashboard-nav-item"]}>
                        <MdSettings className={classes["dashboard-icon"]} /> Settings
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;