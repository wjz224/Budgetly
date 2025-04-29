import "../css/Login.css";
import "../css/LoginShared.css"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignUp from "./GoogleSignUp";
import checkAuth from "../utils/checkAuth";
import {useAuth} from "./AuthContext"; 
function Login() {
    const navigate = useNavigate();
    const {accessToken, loading} = useAuth(); // Access the accessToken from AuthContext
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    
    // Check authentication status on component mount
    useEffect(() => {
        const verifyAuth = async () => {
            if (!accessToken) {
                if (!loading) {
                    setIsLoading(false); // Stop loading if no access token
                }
                return;
            }
            const isAuthenticated = await checkAuth(accessToken); // Call checkAuth with the cookie
            if (isAuthenticated) {
                navigate("/dashboard"); // Redirect to main page if authenticated
                console.log("Authenticated, redirecting to main page...");
            } else {
                setIsLoading(false); // Stop loading if not authenticated
            }
        };
        if (loading !== undefined && !loading){
            console.log("Loading", loading)
            verifyAuth();
        }

    }, [accessToken, loading, navigate]); // Add accessToken and navigate to dependencies


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const signInWithPassAndEmail = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        try {
            const response = await fetch("https://127.0.0.1:8000/login", {
                method: "POST",
                credentials: "include",
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
                setErrorMessage("");
                navigate("/main"); // Redirect to the main page
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login Failed.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    // Show a loading spinner or placeholder while checking authentication
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loading animation if desired
    }

    return (
        <div className="Login">
            <main>
                <section className="section">
                    <form className="form">
                        <div className="logo-container">
                            <img src="/logo.png" alt="Logo" className="logo" />
                        </div>
                        
                        <h2 className="div7">Log in to BudgetAI</h2>
                        <GoogleSignUp setErrorMessage={setErrorMessage} />

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div>
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
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <div className="buttons">
                            <button type="submit" className="button1" onClick={signInWithPassAndEmail}>
                                Login
                            </button>
                            <Link to="/register" className="button2">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Login;