import { UploadImageDataResponse, WeatherResponse } from "@/types/other-types";
import { UPLOAD_IMAGE_TO_CLOUDINARY_FE } from "@/utils/frontEndConstant";

export class OtherService {
  static async getCurrentWeather(
    latitude: string,
    longitude: string,
  ): Promise<WeatherResponse> {
    const response = await fetch(
      `/api/others/weather?latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Internal weather API error:", text);
      throw new Error("Failed to fetch weather data");
    }

    const data: WeatherResponse = await response.json();
    return data;
  }

  static async uploadImage(file: File): Promise<UploadImageDataResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "sample_upload_present");

      const response = await fetch(UPLOAD_IMAGE_TO_CLOUDINARY_FE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Cloudinary API error:", text);
        throw new Error("Failed to upload image");
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
