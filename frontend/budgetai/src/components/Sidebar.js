import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdAttachMoney, MdBarChart, MdChat, MdSettings, MdAccountCircle } from 'react-icons/md';
import '../css/Dashboard.css';

function Sidebar({ onSignOut }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleUserIconClick = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <aside className="dashboard-sidebar">
            <div className="user-icon-container" onClick={handleUserIconClick}>
                <MdAccountCircle className="user-icon" />
                {showDropdown && (
                    <div className="user-dropdown">
                        <button onClick={onSignOut}>Sign Out</button>
                    </div>
                )}
            </div>

            <nav>
                <ul className="dashboard-nav-list">
                    <li className="dashboard-nav-item">
                        <Link to="/dashboard" className="dashboard-link">
                            <MdDashboard className="dashboard-icon" /> Dashboard
                        </Link>
                    </li>
                    <li className="dashboard-nav-item">
                        <Link to="/budgets" className="dashboard-link">
                            <MdDashboard className="dashboard-icon" /> Budgets
                        </Link>
                    </li>
                    <li className="dashboard-nav-item">
                        <MdBarChart className="dashboard-icon" /> Reports
                    </li>
                    <li className="dashboard-nav-item">
                        <MdChat className="dashboard-icon" /> Chat with BudgetAI
                    </li>
                    <li className="dashboard-nav-item">
                        <MdSettings className="dashboard-icon" /> Settings
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;