import React from 'react';
import Sidebar from './Web/Sidebar';
import classes from '../css/Dashboard.module.css';

function Dashboard() {
    const handleSignOut = () => {
        // Add sign-out logic here
        console.log("User signed out");
    };
    
    return (
        <div className={classes["dashboard-container"]}>
            <Sidebar onSignOut={handleSignOut} />
            <main className={classes["dashboard-main-content"]}>
                <div className={classes["page-header"]}>
                    <h2>Dashboard</h2>
                </div>
                <p>Welcome to your dashboard!</p>
            </main>
        </div>
    );
}

export default Dashboard;