"use server";

import { NextResponse } from "next/server";

const DJANGO_SIGNUP_URL = "http://127.0.0.1:8001/api/accounts/signup";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const jsonData = JSON.stringify(requestData);

    const response = await fetch(DJANGO_SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    const responseData = await response.json();
    console.log("Signup Successful:", responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.detail || "Signup failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Signup successful", user: requestData.username },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
