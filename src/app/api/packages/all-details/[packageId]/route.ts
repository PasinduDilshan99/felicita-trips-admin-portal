import { GET_PACKAGE_ALL_DETAILS_BY_PACKAGE_ID_DATA } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

interface PackageParams {
  packageId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: PackageParams | Promise<PackageParams> },
) {
  try {
    const { packageId } = await context.params;

    console.log("package  API - packageId:", packageId);

    if (!packageId) {
      return NextResponse.json(
        { error: "package ID is required" },
        { status: 400 },
      );
    }

    if (!GET_PACKAGE_ALL_DETAILS_BY_PACKAGE_ID_DATA) {
      throw new Error("Backend URL is not defined");
    }

    const backendUrl = `${GET_PACKAGE_ALL_DETAILS_BY_PACKAGE_ID_DATA}/${packageId}`;
    console.log("Backend URL:", backendUrl);
    const cookie = request.headers.get("cookie");

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie && { cookie }),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned error:", text);
      return NextResponse.json(
        { error: "Failed to fetch package details" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching package details:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
