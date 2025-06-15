import React from 'react';
import Sidebar from './Web/Sidebar';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function Budgets() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-main-content">
                <div className="page-header flex justify-between items-center">
                    <h2>Budgets</h2>
                    <Button className="ml-auto">New Budget</Button>
                </div>
                <div className="table-container mt-4">
                    <div className="table-header grid grid-cols-7 gap-4 items-center border-b border-gray-300 pb-2">
                    <input
                    type="checkbox"
                    className="h-5 w-5 mr-2 rounded-sm border border-gray-400 accent-blue-500"
                    />
                        <span className="col-span-1">Budget</span>
                        <button className="col-span-1 text-blue-500 hover:underline">Amount</button>
                        <button className="col-span-1 text-blue-500 hover:underline">Spent</button>
                        <button className="col-span-1 text-blue-500 hover:underline">Net</button>
                        <button className="col-span-1 text-blue-500 hover:underline">Date</button>
                        <span className="col-span-1">Description</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Budgets;