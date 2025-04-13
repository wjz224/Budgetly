import React from 'react';
import { MdDashboard, MdAttachMoney, MdBarChart, MdChat, MdSettings } from 'react-icons/md';
import '../css/Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <nav>
                    <ul className="dashboard-nav-list">
                        <li className="dashboard-nav-item">
                            <MdDashboard className="dashboard-icon" /> Dashboard
                        </li>
                        <li className="dashboard-nav-item">
                            <MdAttachMoney className="dashboard-icon" /> Budgets
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

            <main className="dashboard-main-content">
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </main>
        </div>
    );
}

export default Dashboard;