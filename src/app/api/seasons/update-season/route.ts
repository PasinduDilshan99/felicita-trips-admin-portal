import { UPDATE_SEASON_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!UPDATE_SEASON_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const body = await request.json();
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(UPDATE_SEASON_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // forward cookies
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned error:", text);
      return NextResponse.json(
        { error: "Failed to fetch packages" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching packages" },
      { status: 500 }
    );
  }
}
