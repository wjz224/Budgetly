const checkAuth = async(cookies) =>{
    const response = await fetch("http://127.0.0.1:8000/valid_user",{
        method: "GET",
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