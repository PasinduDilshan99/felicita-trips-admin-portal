"use client"
import React from "react";

const TestPage = () => {
  // Add this function to your AddNewDestinationPage component
  const testApiCall = async () => {
    const testData = {
      name: "Test Destination",
      description: "Test description",
      status: "ACTIVE" as const,
      destinationCategory: "Adventure",
      location: "Test Location",
      latitude: 6.9271,
      longitude: 79.8612,
      extraPrice: 100.1,
      extraPriceNote: "test",
      images: [
        {
          name: "Test Image",
          description: "Test image description",
          imageUrl: "https://example.com/image.jpg",
          status: "ACTIVE" as const,
        },
      ],
    };

    console.log("Testing API call with data:", testData);

    try {
      // Test with explicit headers
      const response = await fetch(
        "http://localhost:8080/felicita/v0/api/destination/add-destination",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(testData),
        }
      );

      console.log("Test response status:", response.status);
      console.log(
        "Test response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const text = await response.text();
      console.log("Test response text:", text);

      if (response.ok) {
        alert("Test successful! Check console for details.");
      } else {
        alert(`Test failed with status ${response.status}: ${text}`);
      }
    } catch (error) {
      console.error("Test error:", error);
      alert("Test failed: " + error.message);
    }
  };

  // Add this button to your form for testing

  return (
    <button
      type="button"
      onClick={testApiCall}
      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
    >
      Test API Call
    </button>
  );
};

export default TestPage;
