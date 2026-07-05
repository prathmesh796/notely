export async function signUp(email:string, password:string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/signUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    })

    if(res.status === 200){
        return {message: "User created successfully", success: true}
    }else{
        return {message: "User creation failed", success: false}
    }
}