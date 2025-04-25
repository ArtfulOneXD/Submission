import { cookies } from "next/headers";

const TOKEN_AGE = 3600;
const TOKEN_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";
const DJANGO_TOKEN_REFRESH_URL = "http://localhost:8001/api/token/refresh";

// Get the access token from server-side cookies
export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

// Get the refresh token from server-side cookies
export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_REFRESH_NAME)?.value || null;
}

// Set the access token as an HttpOnly cookie
export async function setToken(authToken) {
  const cookieStore = await cookies();
  await cookieStore.set(TOKEN_NAME, authToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: TOKEN_AGE,
  });
}

// Set the refresh token
export async function setRefreshToken(authRefreshToken) {
  const cookieStore = await cookies();
  await cookieStore.set(TOKEN_REFRESH_NAME, authRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: TOKEN_AGE,
  });
}

// Delete both tokens
export async function deleteToken() {
  const cookieStore = await cookies();
  await cookieStore.delete(TOKEN_NAME);
  await cookieStore.delete(TOKEN_REFRESH_NAME);
}

// 🔁 Try to refresh the access token if expired
export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(DJANGO_TOKEN_REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      console.warn("🔁 Token refresh failed:", await res.text());
      return null;
    }

    const data = await res.json();
    if (data.access) {
      await setToken(data.access);
      return data.access;
    }

    return null;
  } catch (err) {
    console.error("🔁 Failed to refresh token:", err);
    return null;
  }
}
