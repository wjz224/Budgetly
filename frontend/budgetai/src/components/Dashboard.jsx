import React from 'react';
import Sidebar from './Web/Sidebar';
import { Button } from "@/components/ui/button";

function Dashboard() {
    const handleSignOut = () => {
        // Add sign-out logic here
        console.log("User signed out");
    };
    
    return (
        <div className="budget-container">
            <Sidebar onSignOut={handleSignOut} />
            <main className="budget-main-content">
                <div className="page-header">
                    <h2>Dashboard</h2>
                    <Button className="ml-auto">
                        <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>📊</span>
                        View Reports
                    </Button>
                </div>
                
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            Welcome to your Dashboard! 👋
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Track your budgets, monitor spending, and stay on top of your financial goals.
                        </p>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <h4 className="stat-title">Total Budgets</h4>
                                <p className="stat-value">5</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-content">
                                <h4 className="stat-title">Active Budgets</h4>
                                <p className="stat-value">3</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">💳</div>
                            <div className="stat-content">
                                <h4 className="stat-title">Total Spent</h4>
                                <p className="stat-value">$2,450</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-content">
                                <h4 className="stat-title">Savings Goal</h4>
                                <p className="stat-value">$1,200</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;