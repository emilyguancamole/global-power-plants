import { API_URL } from "../env";
import type { PlantType, CountryCapacityType } from "./types";

// import axios from "axios"; //todo maybe later

export const fetchPlants = async (): Promise<PlantType[]> => {
  const response = await fetch(`${API_URL}/plants/coordinates`);
  // console.log("Raw response:", response);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchTop25 = async (): Promise<CountryCapacityType[]> => {
  // console.log("API_URL:", API_URL);
  const response = await fetch(`${API_URL}/countries/top25`);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`)
  }
  return response.json();
};
