import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

const DJANGO_API_CAMPAIGNS_URL = "http://127.0.0.1:8001/api/campaigns/";  // ✅ Fixed typo

export async function GET(request) {  
    const authToken = await getToken();  // ✅ Await getToken()

    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    };

    try {
        const response = await fetch(DJANGO_API_CAMPAIGNS_URL, options);
        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(result, { status: response.status });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
