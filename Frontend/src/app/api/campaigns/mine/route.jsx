import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/campaigns/mine";
const DJANGO_REFRESH_URL = "http://127.0.0.1:8001/api/token/refresh";
const TOKEN_NAME = "auth-token";
const REFRESH_TOKEN_NAME = "auth-refresh-token";

export async function GET(request) {
  try {
    const cookieStore = await cookies();  // ← Await here
    let accessToken = cookieStore.get(TOKEN_NAME)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_NAME)?.value

    // If no access token, try refresh
    if (!accessToken && refreshToken) {
      const refreshRes = await fetch(DJANGO_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        accessToken = refreshData.access;
        cookieStore.set(TOKEN_NAME, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 3600,
        });
      } else {
        return NextResponse.json(
          { error: "Unauthorized: Token refresh failed" },
          { status: 401 }
        );
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    const res = await fetch(DJANGO_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const resClone = res.clone();
    let data;
    try {
      data = await res.json();
    } catch {
      const rawText = await resClone.text();
      return NextResponse.json(
        { error: "Django returned non-JSON response", raw: rawText },
        { status: res.status }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to fetch user campaigns" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
