import React, { useState } from 'react';
import Sidebar from './Web/Sidebar';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import '../css/BudgetPage.css';

function Budgets() {
    const [selectedBudgets, setSelectedBudgets] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    
    // Sample data - replace with actual data from your backend
    const sampleBudgets = [
        {
            id: 1,
            name: "Monthly Groceries",
            amount: 500.00,
            spent: 320.50,
            net: 179.50,
            date: "2024-01-15",
            description: "Food and household essentials",
            status: "active"
        },
        {
            id: 2,
            name: "Entertainment",
            amount: 200.00,
            spent: 180.00,
            net: 20.00,
            date: "2024-01-10",
            description: "Movies, games, and leisure activities",
            status: "active"
        },
        {
            id: 3,
            name: "Transportation",
            amount: 300.00,
            spent: 350.00,
            net: -50.00,
            date: "2024-01-05",
            description: "Gas, public transport, and maintenance",
            status: "overdue"
        }
    ];

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedBudgets(new Set(sampleBudgets.map(budget => budget.id)));
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
        if (!sortConfig.key) return sampleBudgets;

        return [...sampleBudgets].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle date sorting
            if (sortConfig.key === 'date') {
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const sortedBudgets = getSortedBudgets();

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
                            checked={selectedBudgets.size === sampleBudgets.length}
                            onCheckedChange={handleSelectAll}
                            className="mr-2"
                        />
                        <span>Budget</span>
                        <button onClick={() => handleSort('amount')}>
                            Amount {getSortIcon('amount')}
                        </button>
                        <button onClick={() => handleSort('spent')}>
                            Spent {getSortIcon('spent')}
                        </button>
                        <button onClick={() => handleSort('net')}>
                            Net {getSortIcon('net')}
                        </button>
                        <button onClick={() => handleSort('date')}>
                            Date {getSortIcon('date')}
                        </button>
                        <span>Description</span>
                    </div>
                    
                    {sortedBudgets.length > 0 ? (
                        sortedBudgets.map((budget) => (
                            <div key={budget.id} className="table-row">
                                <Checkbox 
                                    checked={selectedBudgets.has(budget.id)}
                                    onCheckedChange={(checked) => handleSelectBudget(budget.id, checked)}
                                />
                                <div className="table-cell budget-name">
                                    <span className={`status-indicator status-${budget.status}`}></span>
                                    {budget.name}
                                </div>
                                <div className="table-cell amount">
                                    {formatCurrency(budget.amount)}
                                </div>
                                <div className="table-cell spent">
                                    {formatCurrency(budget.spent)}
                                </div>
                                <div className={`table-cell net ${budget.net < 0 ? 'text-red-600' : ''}`}>
                                    {formatCurrency(budget.net)}
                                </div>
                                <div className="table-cell date">
                                    {formatDate(budget.date)}
                                </div>
                                <div className="table-cell description">
                                    {budget.description}
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