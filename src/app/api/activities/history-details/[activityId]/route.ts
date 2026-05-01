import { GET_ACTIVITY_HISTORY_DETAILS_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

interface ActivityParams {
  activityId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: ActivityParams | Promise<ActivityParams> },
) {
  try {
    const { activityId } = await context.params;

    console.log("tour History API - activityId:", activityId);

    if (!activityId) {
      return NextResponse.json(
        { error: "tour ID is required" },
        { status: 400 },
      );
    }

    if (!GET_ACTIVITY_HISTORY_DETAILS_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const backendUrl = `${GET_ACTIVITY_HISTORY_DETAILS_DATA}/${activityId}`;
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
        { error: "Failed to fetch tour details" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tour details:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
