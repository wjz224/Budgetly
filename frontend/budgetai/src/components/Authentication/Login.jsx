import classes from "../../css/LoginShared.module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignUp from "./utils/GoogleSignUp";
import checkAuth from "./utils/checkAuth";
import { useAuth } from "./utils/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { accessToken, loading } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            if (!accessToken) {
                if (!loading) setIsLoading(false);
                return;
            }
            const isAuthenticated = await checkAuth(accessToken);
            if (isAuthenticated) {
                navigate("/dashboard");
            } else {
                setIsLoading(false);
            }
        };
        if (loading !== undefined && !loading) {
            verifyAuth();
        }
    }, [accessToken, loading, navigate]);

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
        e.preventDefault();
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
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
                await response.json();
                setErrorMessage("");
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login Failed.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <main>
                <section className={classes.section}>
                    <form className={classes.form}>
                        <div className={classes["logo-container"]}>
                            <img src="/logo.png" alt="Logo" className={classes.logo} />
                        </div>
                        <h2 className={classes.div7}>Log in to BudgetAI</h2>
                        <GoogleSignUp setErrorMessage={setErrorMessage} className={classes.GoogleButton} />
                        <div className={classes.divider}>
                            <span>OR</span>
                        </div>
                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                className={classes.input}
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
                                className={classes.input}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                        <div className={classes.buttons}>
                            <button type="submit" className={classes.button1} onClick={signInWithPassAndEmail}>
                                Login
                            </button>
                            <Link to="/register" className={classes.button2}>
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