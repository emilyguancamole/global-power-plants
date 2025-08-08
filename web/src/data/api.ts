import { API_URL } from "../env";
import type { PlantType } from "./types";

// import axios from "axios";

export const fetchPlants = async (): Promise<PlantType[]> => {
  console.log("API_URL:", API_URL);
  const response = await fetch(`${API_URL}/plants/coordinates`);
  console.log("Raw response:", response);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

// export const fetchTopCountries = () => {
//   axios.get(`${API_URL}/top-countries`);
// };
