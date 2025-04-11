import "../css/Login.css"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import app from "../firebase/firebaseConfig"; 
import app from "../firebase/firebaseConfig"; 


const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const signUpWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken(); // Get the Google ID token
 
        // Send the ID token to your backend
        const response = await fetch("http://127.0.0.1:8000/google-signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
        });
        const data = await response.json();
        console.log("Backend Response:", data);
    } catch (error) {
        console.error("Error signing up with Google:", error);
    }
};

function GoogleSignUp(){
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