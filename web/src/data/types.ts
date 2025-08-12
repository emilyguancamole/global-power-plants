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
