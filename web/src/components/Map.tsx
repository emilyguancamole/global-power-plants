import { useEffect, useState } from "react";
import { fetchPlants } from "../data/api";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { PlantType } from "../data/types";

const FUEL_COLORS: Record<string, string> = {
  Solar: "#f5da2a",
  Wind: "#697cd4ff",
  Hydro: "#088bb3ff",
  Gas: "lightgreen",
  Oil: "brown",
  Coal: "black",
  Nuclear: "pink",
  Biomass: "green",
  Other: "purple",
};

const Map = () => {
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchPlants().then((data: PlantType[]) => {
      setPlants(data);
      //? render in batches to avoid performance issues with large datasets
      // let batchSize = 1000;
      // let index = 0;
      // const addBatch = () => {
      //   setPlants(prev => [...prev, ...data.slice(index, index + batchSize)]);
      //   index += batchSize;
      //   if (index < data.length) setTimeout(addBatch, 50); // next batch after 100ms
      // };
      // addBatch();
    })
    .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "600px", width: "100%" }}
      preferCanvas={true} // faster than svg
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* <MarkerClusterGroup chunkedLoading> */}
        {plants.map((plant) => (
          <CircleMarker
            key={plant.gppd_idnr}
            center={[plant.latitude, plant.longitude]}
            radius={plant.capacity_mw > 1000 ? 3 : 2} //? scale size
            pathOptions={{
              color: FUEL_COLORS[plant.primary_fuel] || "gray",
              fillOpacity: 0.7,
            }} 
          >
          </CircleMarker>
        ))}
      {/* </MarkerClusterGroup> */}
      
    </MapContainer>
  );
};

export default Map;
