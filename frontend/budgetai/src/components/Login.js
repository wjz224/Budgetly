import "../css/Login.css"
import {useState} from 'react'
import { Link } from "react-router-dom";
function Login(){
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

    return (
        <div className = "Login">
            <main>
                <section className = "LoginSection">
                <form className = "LoginForm">
                    <div className="GoogleSignIn">
                        <button type="button" className="GoogleButton">
                            <img
                                src="/Google-symbol.png"
                                alt="Google Logo"
                                className="GoogleLogo"
                            />
                            Google
                        </button>
                    </div>
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
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="LoginSubmit">
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