const checkAuth = async(cookies) =>{
    console.log("authorization hehe:", cookies)
    const response = await fetch("http://127.0.0.1:8000/ping",{
        method: "POST",
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