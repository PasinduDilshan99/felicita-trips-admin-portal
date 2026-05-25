import { GET_TOURS_DETAILS_BY_REQUEST_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!GET_TOURS_DETAILS_BY_REQUEST_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const body = await request.json();
    // Forward cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(GET_TOURS_DETAILS_BY_REQUEST_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // send cookies to backend
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned error:", text);
      return NextResponse.json(
        { error: "Failed to fetch popular tours" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching popular tours:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching popular tours" },
      { status: 500 }
    );
  }
}
