import "../css/Login.css"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/firebaseConfig"; 
import {useNavigate} from "react-router-dom";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function GoogleSignUp({setErrorMessage, setCookie}){
    const navigate = useNavigate();
    const signUpWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken(); // Get the Google ID token
     
            // Send the ID token to backend
            const response = await fetch("http://127.0.0.1:8000/google-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });

            if (response.ok){
                const data = await response.json();
                // Store the JWT token as a cookie
                setCookie("authorization", data.token, {
                    path: "/", // Cookie is accessible across the entire site
                    maxAge: 7 * 24 * 60 * 60, // Cookie valid for 7 days
                    secure: false, // Set to true if using HTTPS
                    sameSite: "strict", // Prevent CSRF attacks
                });
                // redirect to main page
                navigate("/main");
            }
            else{
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Google Sign Up failed.");
            }
        } catch (error) {
            console.error("Error signing up with Google:", error);
        }
    };
    
    return(
        <div className="GoogleSignIn">
            <button type="button" className="GoogleButton" onClick={signUpWithGoogle}>
                <img
                    src="/Google-symbol.png"
                    alt="Google Logo"
                    className="GoogleLogo"
                />
                Google
            </button>
        </div>
    )
}

export default GoogleSignUp;