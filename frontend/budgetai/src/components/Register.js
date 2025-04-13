import "../css/Register.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignUp from "./GoogleSignUp";
import { useCookies } from "react-cookie";
import checkAuth from "../utils/checkAuth"; // Import the checkAuth function

function Register() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["authorization"]);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    // Check authentication status on component mount
    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await checkAuth(cookies.authorization); // Call checkAuth with the cookie
            if (isAuthenticated) {
                navigate("/main"); // Redirect to main page if authenticated
            } else {
                setIsLoading(false); // Stop loading if not authenticated
            }
        };

        if (cookies.authorization !== undefined) {
            verifyAuth();
        } else {
            setIsLoading(false); // Stop loading if no cookie is present
        }
    }, [cookies.authorization, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading when the form is submitted

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setIsLoading(false); // Stop loading if validation fails
            return;
        }

        try {
            // Send registration data to the backend
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(data.message);
                setErrorMessage("");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Registration failed.");
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            setSuccessMessage("");
        } finally {
            setIsLoading(false); // Stop loading after the request is complete
        }
    };

    // Show a loading spinner or placeholder while checking authentication or submitting the form
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loading animation if desired
    }

    return (
        <div className="BudgetAI">
            <main className="div1">
                <section className="div5">
                    <div className="div6">
                        <h2 className="div7">Sign Up</h2>
                        <p className="div8">Manage your budgets with BudgetAI!</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <GoogleSignUp className="googleButton" />

                        <div className="divider">
                            <span>OR</span>
                        </div>

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

                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}

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

export default Register;

