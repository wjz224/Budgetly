import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdAttachMoney, MdBarChart, MdChat, MdSettings, MdAccountCircle } from 'react-icons/md';
import classes from '../../css/Dashboard.module.css';

function Sidebar({ onSignOut }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleUserIconClick = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <aside className={classes["dashboard-sidebar"]}>
            <div className={classes["user-icon-container"]} onClick={handleUserIconClick}>
                <MdAccountCircle className={classes["user-icon"]} />
                {showDropdown && (
                    <div className={classes["user-dropdown"]}>
                        <button onClick={onSignOut}>Sign Out</button>
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