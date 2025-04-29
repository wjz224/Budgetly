import "../css/Login.css"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/firebaseConfig"; 
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function GoogleSignUp({setErrorMessage}){
    const navigate = useNavigate();

    const signUpWithGoogle = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken(); // Get the Google ID token
            const refreshToken = result.user.refreshToken; // Get the Google refresh token
     
            // Send the ID token to backend
            const response = await fetch("https://127.0.0.1:8000/google-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken, refreshToken}),
            });

            if (response.ok){
                const data = await response.json();
                console.log(result.user)
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