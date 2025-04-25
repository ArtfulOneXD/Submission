"use client";

import { useAuth } from "@/components/authProvider";


const LOGOUT_URL = "/api/logout/"


export default function Page() {
        const auth = useAuth()  
    

    async function handleClick(event) {
        event.preventDefault(); // Prevents default form submission
        const requestOptions = {
            method: "POST",
            headers: {
              
                "Content-Type": "appplication/json"
            },
            body: ""

        }
        const response = await fetch(LOGOUT_URL,requestOptions)
        if (response.ok){
            console.log("Logged Out")
            auth.login()
            

        }
    }

    return (
        <div className="h-[95vh]">
            <div className="max-w-md mx-auto py-5"> 
                <h1>Are you sure you want to logout?</h1>
                <button 
                    className="bg-red-500 text-white hover:bg-red-300 px-3 py-2"
                    onClick={handleClick}
                >
                    Yes, LogOut
                </button>
            </div>
        </div>
    );
}
