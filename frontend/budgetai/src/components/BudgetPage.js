import React from 'react';
import Sidebar from './Sidebar';
import '../css/Dashboard.css';

function Budgets() {

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-main-content">
                <div className="page-header">
                    <h2>Budgets</h2>
                </div>
                <div className="page-header"></div>
                <p>hello</p>
            </main>
        </div>
    );
}

export default Budgets;