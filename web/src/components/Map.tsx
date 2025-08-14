import { useEffect, useState } from "react";
import { fetchPlants } from "../data/api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet"; // Leaflet for custom layers
import { FUEL_COLORS, type PlantType } from "../data/types";

//TODO ADD KEY FOR COLORS

function Map() {
  const [plants, setPlants] = useState<PlantType[]>([]);

  useEffect(() => {
    fetchPlants().then((data: PlantType[]) => {
      setPlants(data);
    });
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      preferCanvas={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <PlantsLayer plants={plants} />
    </MapContainer>
  );
}

function PlantsLayer({ plants }: { plants: PlantType[] }) {
  const map = useMap();

  useEffect(() => {
    if (!plants.length) return;

    // Convert plants array to geojson FeatureCollection (array of Features, each w/ properties and geometry)
    const geojsonData = {
      type: "FeatureCollection" as const,
      features: plants.map((p) => ({
        type: "Feature" as const,
        properties: {
          fuel: p.primary_fuel,
          capacity_mw: p.capacity_mw,
          name: p.name,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [p.longitude, p.latitude] as [number, number],
        },
      })),
    };

    // Create one layer with all points
    const layer = L.geoJSON(geojsonData, {
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: feature.properties.capacity_mw > 1000 ? 3 : 2,
          color: FUEL_COLORS[feature.properties.fuel] || "gray",
          fillOpacity: 0.7,
          stroke: false,
        }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const marker = e.target;
            const capacity = Math.round(
              feature.properties.capacity_mw,
            ).toLocaleString();
            marker
              .bindTooltip(`${feature.properties.name} - ${capacity} MW`)
              .openTooltip();
          },
        });
      },
    });

    layer.addTo(map);

    // Clean up the layer when component unmounts
    return () => {
      map.removeLayer(layer);
    };
  }, [plants, map]);

  return null;
}


export default Map;

// const Map = () => {
//   const [plants, setPlants] = useState<PlantType[]>([]);
//   const [visiblePlants, setVisiblePlants] = useState<PlantType[]>([]);

//   // Fetch power plant data
//   useEffect(() => {
//     fetchPlants().then((data: PlantType[]) => {
//       // deduplicate by gppd_idnr
//       const unique: PlantType[] = Array.from(
//         new window.Map(data.map(p => [p.gppd_idnr, p])).values()
//       );
//       setPlants(unique);
//       setVisiblePlants(unique.slice(0, 1000));
//       setTimeout(() => setVisiblePlants(unique.slice(0, 500)), 200);
//       setTimeout(() => setVisiblePlants(unique), 200);
//     })
//     .catch((error) => console.error("Error fetching plants:", error));
//   }, []);

//   return (
//     <MapContainer
//       center={[20, 0]}
//       zoom={2}
//       style={{ height: "600px", width: "100%" }}
//       preferCanvas={true} // faster than svg
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {/* <MarkerClusterGroup chunkedLoading> */}
//         {visiblePlants.map((plant) => (
//           <CircleMarker
//             key={plant.gppd_idnr}
//             center={[plant.latitude, plant.longitude]}
//             radius={plant.capacity_mw > 1000 ? 3 : 2} //? scale size
//             pathOptions={{
//               color: FUEL_COLORS[plant.primary_fuel] || "gray",
//               fillOpacity: 0.7,
//               stroke: false
//             }}
//             eventHandlers={{
//               mouseover: (e) => {
//                 const marker = e.target;
//                 marker.bindTooltip(`${plant.name} - ${plant.capacity_mw} MW`).openTooltip();
//               }
//             }}
//           >
//           </CircleMarker>
//         ))}
//       {/* </MarkerClusterGroup> */}

//     </MapContainer>
//   );
// };

// export default Map;
