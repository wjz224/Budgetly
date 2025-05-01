const checkAuth = async(accessToken) =>{
    try {
        const response = await fetch("https://127.0.0.1:8000/valid_user",{
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${accessToken}`
            }, 
        
        }); 

        return response.ok; // Return true if the response is OK, otherwise false
    } catch (err) {
        console.error("Error in checkAuth:", err);
        return false;
    }
}

export default checkAuth;