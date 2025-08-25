import { API_KEY } from "./config"; // Import API key

const API_URL = "https://api.spacely.ai/api/v1/generate/color-transfer";

/**
 * Calls Spacely AI's color transfer API.
 * @param {string} imageUrl - URL of the uploaded image.
 * @param {string} area - The area to apply the color ("wall", "ceiling", "floor").
 * @param {string} color - The color to apply.
 * @returns {Promise<Object>} - API response.
 */
export async function applyColorTransfer(imageUrl, area, color) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imageUrl, area, color }),
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json(); // Assuming API returns JSON
  } catch (error) {
    console.error("Error applying color transfer:", error);
    throw error;
  }
}