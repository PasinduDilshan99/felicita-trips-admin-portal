import { ADD_TRENDING_DESTINATIONS_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!ADD_TRENDING_DESTINATIONS_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const body = await request.json();

    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(ADD_TRENDING_DESTINATIONS_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned error:", text);
      return NextResponse.json(
        { error: "Failed to fetch destinations" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching destinations" },
      { status: 500 },
    );
  }
}
