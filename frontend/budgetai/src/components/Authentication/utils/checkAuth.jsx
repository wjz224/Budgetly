const checkAuth = async(accessToken) =>{
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/valid_user",{
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