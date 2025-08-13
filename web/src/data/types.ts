export interface PlantType {
  gppd_idnr: string;
  name: string;
  capacity_mw: number;
  latitude: number;
  longitude: number;
  primary_fuel: string;
}

export interface CountryCapacityType {
  country_code: string;
  country_name: string;
  tot_capacity: number;
}

export interface CountryDataType {
  country_code: string; // consistent with names of fields returned by api
  country_name: string;
}

export interface GenerationOverTimeType {
  year: number;
  yearly_generation: number;
}

export interface GenerationChartDataPoint { //? 2020, USA: 321, CAN: 203
  year: number;
  [country_code: string]: number | null;
}

export interface FuelShareType {
  primary_fuel: string;
  tot_capacity: number;
}

export const FUEL_COLORS: Record<string, string> = {
  Solar: "#f5da2a",
  Wind: "#6997d4ff",
  Hydro: "#088bb3ff",
  Gas: "#42d57dff",
  Oil: "brown",
  Coal: "black",
  Nuclear: "pink",
  Biomass: "green",
  "Wave and Tidal": "purple",
  Petcoke: "orange",
  Waste: "#9a1b54ff",
  Storage: "#dfb678ff",
  Geothermal: "#ed9613ff",
  Cogeneration: "#a16fd3ff"
};