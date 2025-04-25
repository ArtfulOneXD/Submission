import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getToken, refreshAccessToken } from "@/lib/auth"; // ✅ use your existing functions

const USER_INFO_URL = "http://localhost:8001/api/accounts/me";
const DJANGO_TOKEN_REFRESH_URL = "http://localhost:8001/api/token/refresh/";

export async function GET() {
  try {
    console.log("🔄 [API] Account: Attempting to load cookies...");
    
    // Get access token (from server cookies)
    let accessToken = await getToken();
    console.log("🍪 Access Token:", accessToken);

    // No access token? Try refreshing it
    if (!accessToken) {
      console.log("🔁 No access token found, trying refresh...");
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        console.warn("⛔ Refresh failed or no refresh token available.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // ✅ Use access token to query Django API
    console.log("📡 Fetching user info from Django...");
    let res = await fetch(USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ⛔ Token might have expired — try refreshing on 401
    if (res.status === 401) {
      console.warn("⚠️ Token may have expired. Attempting a second refresh...");
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized (after retry)" }, { status: 401 });
      }

      res = await fetch(USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Django user info fetch failed:", res.status, errText);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: res.status });
    }

    const user = await res.json();
    console.log("✅ User data received:", user);
    return NextResponse.json(user);
    
  } catch (err) {
    console.error("🔥 Unexpected server error in account route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
