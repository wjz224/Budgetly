import "../css/Register.css"
import React, { useState } from 'react';
import { Link } from "react-router-dom";

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
        console.log("Form submitted:", formData);
      };

    return (
        <div className="BudgetAI">
            <main>
                <section className="div5">
                    <div className="div6">
                        <h2 className="div7">Sign Up</h2>
                        <p className="div8">Manage your budgets with BudgetAI!</p>
                    </div>
                    
                    <form>
   

                        <div>
                            <label htmlFor="email"></label>  
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                className="input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password"></label>  
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword"></label>  
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm password"
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
                            <Link to="/login" className="button2">
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </section>
            </main> 
        </div>


    );

    
}

export default Register

