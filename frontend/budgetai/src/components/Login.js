import "../css/Login.css"
import {useState} from 'react'
import {Link ,useNavigate} from "react-router-dom";
import GoogleSignUp from "./GoogleSignUp";
import { useCookies } from "react-cookie"; 

function Login(){
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [cookies, setCookie] = useCookies(["authorization"]); 
    
    const [formData, setFormData] = useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };   


    const signInWithPassAndEmail = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        try {
            // Send email and password to the backend
            const response = await fetch("http://127.0.0.1:8000/login", {
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
                setErrorMessage("");

                console.log("Login Response:", data);
                
                // Store the JWT token as a cookie
                setCookie("authorization", data.token, {
                    path: "/", // Cookie is accessible across the entire site
                    maxAge: 7 * 24 * 60 * 60, // Cookie valid for 7 days
                    secure: false, // Set to true if using HTTPS
                    sameSite: "strict", // Prevent CSRF attacks
                });

                // Redirect to the main page
                navigate("/main");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Login Failed.");

            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className = "Login">
            <main>
                <section className = "LoginSection">
                <form className = "LoginForm">
                    <GoogleSignUp/>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email address"
                            className="LoginEmail"
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
                            className="LoginPass"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <div>
                        <button type="submit" className="LoginSubmit" onClick={signInWithPassAndEmail}>
                            Login
                        </button>
                        <Link to="/register" className="SignupButton">Sign Up</Link>
                    </div>
                </form>
                </section>
            </main>
        </div>
    )
}

export default Login