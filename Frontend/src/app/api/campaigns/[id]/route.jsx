import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;

  const res = await fetch(`http://localhost:8001/api/campaigns/campaign/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
