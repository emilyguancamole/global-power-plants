import { API_URL } from "../env";
import type {
  PlantType,
  CountryCapacityType,
  CountryDataType,
  GenerationOverTimeType,
} from "./types";

// import axios from "axios"; //todo maybe later

export const fetchPlants = async (): Promise<PlantType[]> => {
  const response = await fetch(`${API_URL}/plants/coordinates`);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchCountries = async (): Promise<CountryDataType[]> => {
  const response = await fetch(`${API_URL}/countries`);
  console.log("Raw response:", response);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
}

export const fetchTop25 = async (): Promise<CountryCapacityType[]> => {
  // console.log("API_URL:", API_URL);
  const response = await fetch(`${API_URL}/countries/top25`);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchGenerationOverTime = async (
  code: string,
): Promise<GenerationOverTimeType[]> => {
  const response = await fetch(
    `${API_URL}/countries/${code}/generation-over-time`,
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};
