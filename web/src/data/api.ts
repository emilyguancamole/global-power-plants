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
  // console.log("Raw response:", response);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchTop25 = async (): Promise<CountryCapacityType[]> => {
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

export const fetchFuelShare = async () => {
  const response = await fetch(`${API_URL}/plants/fuel-share`);
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const editCountryCapacity = async (code: string, capacity: number) => {
  const response = await fetch(`${API_URL}/countries/${code}/capacity-mw`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ capacity }), // request body as JSON
  });
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const editCountryYearlyGeneration = async (
  code: string,
  year: number,
  generationData: number,
) => {
  const response = await fetch(
    `${API_URL}/countries/${code}/generation-gwh/${year}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationData }),
    },
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};
