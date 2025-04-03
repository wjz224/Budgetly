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

    return (
        <div className="BudgetAI">

            <header className={Register.header}>
                <div>
                    <img 
                        src="/logo.png" 
                        alt="BudgetAI logo" 
                        className={Register.logo} 
                    />
                </div>  
                <h1 className={Register.div3}>BudgetAI</h1>
                <nav className={Register.div4} aria-label="Main navigation"></nav>
            </header>

            
            <main>
                <section>
                    <div>
                        <h2>Sign Up</h2>
                        <p>Manage your budgets with BudgetAI!</p>
                    </div>
                    
                    <form>
                        <div>
                            <label htmlFor="name">Name</label>  
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className={Register.input}
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
                                className={Register.input}
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
                                className={Register.input}
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
                                className={Register.input}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div>
                            <button type="submit" className={Register.button}>
                                Sign Up
                            </button>
                            <button type="button" className={Register.button}>
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

