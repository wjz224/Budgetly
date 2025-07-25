import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../../../firebase/firebaseConfig"; 
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import classes from "../../../css/LoginShared.module.css"; // Import the CSS module

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function GoogleSignUp({ setErrorMessage, className }) {
    const navigate = useNavigate();

    const signUpWithGoogle = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken(); // Get the Google ID token
            const refreshToken = result.user.refreshToken; // Get the Google refresh token
            // Send the ID token to backend
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/google-signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken, refreshToken}),
            });
            if (response.ok){
                const data = await response.json();
                console.log(result.user)
                // redirect to main page
                navigate("/dashboard");
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
        <div className={classes.GoogleSignIn}>
            <button
                type="button"
                className={`${classes.GoogleButton} ${className || ""}`}
                onClick={signUpWithGoogle}
            >
                <img
                    src="/google-symbol.png"
                    alt="Google Logo"
                    className={classes.GoogleLogo}
                />
                Google
            </button>
        </div>
    )
}

export default GoogleSignUp;