import { GET_DESTINATIONS_DETAILS_BY_ID_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

interface DestinationParams {
  destinationId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: DestinationParams | Promise<DestinationParams> }
) {
  try {
  const { destinationId } = await context.params;

    console.log("Destination History API - destinationId:", destinationId);

    if (!destinationId) {
      return NextResponse.json(
        { error: "Destination ID is required" },
        { status: 400 }
      );
    }

    if (!GET_DESTINATIONS_DETAILS_BY_ID_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const backendUrl = `${GET_DESTINATIONS_DETAILS_BY_ID_DATA}/${destinationId}`;
    console.log("Backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned error:", text);
      return NextResponse.json(
        { error: "Failed to fetch destination history details" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching destination history details:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
