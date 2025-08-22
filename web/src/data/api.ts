import { API_URL, API_KEY } from "../env";
import type {
  PlantType,
  CountryCapacityType,
  CountryDataType,
  GenerationOverTimeType,
} from "./types";

export const fetchPlants = async (): Promise<PlantType[]> => {
  const response = await fetch(`${API_URL}/plants/coordinates`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed with status: 
      ${response.status}`);
  }
  return response.json();
};

export const fetchCountries = async (): Promise<CountryDataType[]> => {
  const response = await fetch(`${API_URL}/countries`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchTop25 = async (): Promise<CountryCapacityType[]> => {
  const response = await fetch(`${API_URL}/countries/top25`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
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
    {
      headers: {
        "x-api-key": API_KEY,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const fetchFuelShare = async () => {
  const response = await fetch(`${API_URL}/plants/fuel-share`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};

export const editCountryCapacity = async (code: string, capacity: number) => {
  const response = await fetch(`${API_URL}/countries/${code}/capacity-mw`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
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
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ generationData }),
    },
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return response.json();
};
