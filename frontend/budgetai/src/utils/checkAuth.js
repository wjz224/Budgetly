const checkAuth = async(cookies) =>{
    const response = await fetch("https://127.0.0.1:8000/valid_user",{
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "authorization": `${cookies}`
        }, 
       
    }); 

    if (response.ok) {
        return true
    } else {
        return false
    }   
}

export default checkAuth;