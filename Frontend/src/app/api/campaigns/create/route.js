// src/app/api/campaigns/create/route.js

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/auth";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/campaigns/create";

async function sendRequestWithToken(body, token) {
  return await fetch(DJANGO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = cookies();

    // Step 1: Get access token from cookies
    let accessToken = cookieStore.get("auth-token")?.value || null;

    // Step 2: Try to send the request
    let res = await sendRequestWithToken(body, accessToken);

    // Step 3: If token is missing or expired (401), try refreshing
    if (res.status === 401) {
      console.warn("🔁 Token expired, attempting refresh...");
      accessToken = await refreshAccessToken();

      if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Retry with new token
      res = await sendRequestWithToken(body, accessToken);
    }

    // Step 4: Return response from Django
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error("🔥 Campaign create API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
