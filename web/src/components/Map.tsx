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
      center={[25, 0]}
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
