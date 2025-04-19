import "../css/Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import checkAuth from "../utils/checkAuth"; // Import the checkAuth function
import { useAuth } from "./AuthContext"; 

function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    // Check authentication status on component mount
    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await checkAuth(useAuth.accessToken); // Call checkAuth with the cookie
            if (isAuthenticated) {
                navigate("/main"); // Redirect to main page if authenticated
            } else {
                setIsLoading(false); // Stop loading if not authenticated
            }
        };

        if (useAuth.accessToken !== undefined) {
            verifyAuth();
        } else {
            setIsLoading(false); // Stop loading if no cookie is present
        }
    }, [useAuth.accessToken, navigate]);

    // Show a loading spinner or placeholder while checking authentication
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loading animation if desired
    }

    return (
        <div className="Home">
            <h1>Welcome to BudgetAI Home</h1>
            {/* Add your home page content here */}
        </div>
    );
}

export default Home;