//save-images/route.ts

import { UPLOAD_IMAGE_TO_CLOUDINARY } from "@/utils/backEndConstant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("upload_preset", "felicita_web");

    const cloudinaryRes = await fetch(UPLOAD_IMAGE_TO_CLOUDINARY, {
      method: "POST",
      body: cloudinaryForm,
    });

    const data = await cloudinaryRes.json();
    if (!cloudinaryRes.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
