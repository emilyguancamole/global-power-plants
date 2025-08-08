import { useEffect, useState } from "react";
import { fetchPlants } from "../data/api";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { PlantType } from "../data/types";

const FUEL_COLORS: Record<string, string> = {
  Solar: "orange",
  Wind: "lightblue",
  Hydro: "blue",
  Gas: "gray",
  Oil: "black",
  Coal: "brown",
  Nuclear: "pink",
  Biomass: "green",
  Other: "purple",
};

const Map = () => {
  const [plants, setPlants] = useState<PlantType[]>([]);

  useEffect(() => {
    fetchPlants()
      .then((data: PlantType[] | undefined) => {
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          setPlants([]);
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {plants.map((plant) => (
        // <MarkerClusterGroup -- didn't work fo rmaking it faster
        <CircleMarker
          key={plant.gppd_idnr}
          center={[plant.latitude, plant.longitude]}
          radius={Math.max(2, Math.sqrt(plant.capacity_mw/500))} // scale size
          pathOptions={{
            color: FUEL_COLORS[plant.primary_fuel] || "gray",
            fillOpacity: 0.7,
          }}
        >
          <Tooltip direction="top" offset={[0, -5]} opacity={1}>
            <span>
              {plant.name} - {plant.primary_fuel} - {plant.capacity_mw} MW
            </span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default Map;
