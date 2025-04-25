import { deleteToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        deleteToken(); // ✅ Await the token deletion

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 }); // ✅ Corrected response
    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
