import "../css/Register.css"
import React, { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };   

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic would go here
        console.log("Form submitted:", formData);
      };

    return (
        <div className="BudgetAI">

            <header className="header">
                <div className="logo-container">
                    <div className="logo">
                        <img 
                            src="logo.png" 
                            alt="BudgetAI logo"
                            className="logo"
                        />
                    </div>  
                </div>
                <nav className="div4" aria-label="Main navigation"></nav>
            </header>

            
            <main>
                <section className="div5">
                    <div className="div6">
                        <h2 className="div7">Sign Up</h2>
                        <p className="div8">Manage your budgets with BudgetAI!</p>
                    </div>
                    
                    <form>
                        <div>
                            <label htmlFor="name">Name</label>  
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className="input"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email</label>  
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>  
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                            <p>Minimum 8 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword">confirmPassword</label>  
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Enter your password"
                                className="input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div className="div31">
                            <button type="submit" className="button">
                                Sign Up
                            </button>
                            <button type="button" className="button2">
                                Already have an account? Login
                            </button>
                        </div>
                    </form>
                </section>
            </main> 
        </div>


    );

    
}

export default Register

