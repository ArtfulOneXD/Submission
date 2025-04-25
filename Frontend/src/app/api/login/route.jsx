"use server";

import { setRefreshToken, setToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const DJANGO_API_LOGIN_URL = "http://127.0.0.1:8001/api/token/pair";

export async function POST(request) {
    try {
        const requestData = await request.json();
        const jsonData = JSON.stringify(requestData);
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        };

        const response = await fetch(DJANGO_API_LOGIN_URL, requestOptions);
        
        if (!response.ok) {
            // ✅ Return the exact status from Django API
            return NextResponse.json({ error: "Invalid credentials" }, { status: response.status });
        }

        const responseData = await response.json();
        console.log("Login Successful:", responseData);

        const { access, refresh } = responseData;
        await setToken(access);  // ✅ Await if async
        await setRefreshToken(refresh);  // ✅ Await if async

        return NextResponse.json({ "loggedIn": true }, { status: 200 });

    } catch (error) {
        console.error("Error contacting Django API:", error);
        return NextResponse.json({ "loggedIn": false, error: error.message }, { status: 500 });  // ✅ Return proper error message
    }
}
