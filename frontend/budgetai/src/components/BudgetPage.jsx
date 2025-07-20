import React, { useState, useEffect } from 'react';
import Sidebar from './Web/Sidebar';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from './Authentication/utils/AuthContext';
import '../css/BudgetPage.css';

function Budgets() {
    const { accessToken } = useAuth();
    const [selectedBudgets, setSelectedBudgets] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch budgets from backend
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                setLoading(true);
                
                if (!accessToken) {
                    throw new Error('No authorization token found');
                }

                // Get the backend URL from environment variables
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                if (!backendUrl) {
                    throw new Error('Backend URL not configured');
                }

                const response = await fetch(`${backendUrl}/budgets`, {
                    method: 'GET',
                    headers: {
                        'authorization': accessToken,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized - Please log in again');
                    } else if (response.status === 403) {
                        throw new Error('Access denied');
                    } else {
                        throw new Error(`Failed to fetch budgets: ${response.status}`);
                    }
                }

                const data = await response.json();
                setBudgets(data.budgets || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching budgets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, [accessToken]);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedBudgets(new Set(budgets.map(budget => budget.BudgetID)));
        } else {
            setSelectedBudgets(new Set());
        }
    };

    const handleSelectBudget = (budgetId, checked) => {
        const newSelected = new Set(selectedBudgets);
        if (checked) {
            newSelected.add(budgetId);
        } else {
            newSelected.delete(budgetId);
        }
        setSelectedBudgets(newSelected);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedBudgets = () => {
        if (!sortConfig.key) return budgets;

        return [...budgets].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle date sorting
            if (sortConfig.key === 'BudgetStartDate' || sortConfig.key === 'BudgetEndDate' || sortConfig.key === 'CreatedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return '↕️'; // Neutral sort icon
        }
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'dollars' ? 'USD' : currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sortedBudgets = getSortedBudgets();

    if (loading) {
        return (
            <div className="budget-container">
                <Sidebar />
                <main className="budget-main-content">
                    <div className="page-header">
                        <h2>Budgets</h2>
                        <Button className="ml-auto">
                            <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>+</span>
                            New Budget
                        </Button>
                    </div>
                    <div className="table-container">
                        <div className="loading-skeleton" style={{ height: '200px', margin: '2rem' }}></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="budget-container">
                <Sidebar />
                <main className="budget-main-content">
                    <div className="page-header">
                        <h2>Budgets</h2>
                        <Button className="ml-auto">
                            <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>+</span>
                            New Budget
                        </Button>
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">⚠️</div>
                        <h3>Error loading budgets</h3>
                        <p>{error}</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="budget-container">
            <Sidebar />
            <main className="budget-main-content">
                <div className="page-header">
                    <h2>Budgets</h2>
                    <Button className="ml-auto">
                        <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>+</span>
                        New Budget
                    </Button>
                </div>
                
                <div className="table-container">
                    <div className="table-header">
                        <Checkbox 
                            checked={selectedBudgets.size === budgets.length && budgets.length > 0}
                            onCheckedChange={handleSelectAll}
                            className="mr-2"
                        />
                        <span>Budget</span>
                        <button onClick={() => handleSort('BudgetAmount')}>
                            Amount {getSortIcon('BudgetAmount')}
                        </button>
                        <button onClick={() => handleSort('BudgetStartDate')}>
                            Start Date {getSortIcon('BudgetStartDate')}
                        </button>
                        <button onClick={() => handleSort('BudgetEndDate')}>
                            End Date {getSortIcon('BudgetEndDate')}
                        </button>
                        <button onClick={() => handleSort('CreatedAt')}>
                            Created {getSortIcon('CreatedAt')}
                        </button>
                        <span>Description</span>
                    </div>
                    
                    {sortedBudgets.length > 0 ? (
                        sortedBudgets.map((budget) => (
                            <div key={budget.BudgetID} className="table-row">
                                <Checkbox 
                                    checked={selectedBudgets.has(budget.BudgetID)}
                                    onCheckedChange={(checked) => handleSelectBudget(budget.BudgetID, checked)}
                                />
                                <div className="table-cell budget-name">
                                    <span className="status-indicator status-active"></span>
                                    {budget.BudgetName}
                                </div>
                                <div className="table-cell amount">
                                    {formatCurrency(budget.BudgetAmount, budget.Currency)}
                                </div>
                                <div className="table-cell date">
                                    {formatDate(budget.BudgetStartDate)}
                                </div>
                                <div className="table-cell date">
                                    {formatDate(budget.BudgetEndDate)}
                                </div>
                                <div className="table-cell date">
                                    {formatDateTime(budget.CreatedAt)}
                                </div>
                                <div className="table-cell description">
                                    {budget.BudgetDescription}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3>No budgets yet</h3>
                            <p>Create your first budget to start tracking your expenses</p>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Create Budget
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Budgets;