import "../css/Login.css"
import {useState} from 'react'
import  {Link} from 'react-router-dom'
function Login(){
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
        <div className = "Login">
            <main>
                <section className = "LoginSection">
                <form className = "LoginForm">
                    <div>
                        <label htmlFor="email">Email</label>  
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="LoginEmail"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <label htmlFor="password">Password</label>  
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
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
                        <button type="button" className="LoginRegister">
                            Don't have an account? Register here!
                        </button>
                    </div>
                </form>
                </section>
            </main>
            
        </div>
    )
}

export default Login