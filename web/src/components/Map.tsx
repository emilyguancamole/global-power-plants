import { useEffect, useState } from "react";
import { fetchPlants } from "../data/api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet"; // Leaflet for custom layers
import { FUEL_COLORS, type PlantType } from "../data/types";


function Map() {
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    fetchPlants().then((data: PlantType[]) => {
      setPlants(data);
    });
  }, []);

  const fuelTypes = Object.keys(FUEL_COLORS);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Map */}
      <MapContainer
        center={[25, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        preferCanvas={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <PlantsLayer plants={plants} />
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 8,
          padding: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: 11,
          zIndex: 1000, // ensure legend is above map
          cursor: "pointer",
        }}
      >
        <div 
          onClick={() => setShowLegend((open) => !(open))}
          style={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
          Fuel Type
          <span style={{fontSize: 12}}>
            {showLegend ? "⌄" : "⌃"}
          </span>
        </div>
        {showLegend && (<div 
          style={{ 
            display: "flex", flexDirection: "column", gap: 4, marginTop: 4 
          }}>
          {fuelTypes.map((fuel) => (
            <div key={fuel} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  background: FUEL_COLORS[fuel],
                  border: "1px solid #ccc",
                  marginRight: 6,
                }}
              />
              <span>{fuel}</span>
            </div>
          ))}
        </div>)}
      </div>
    </div>
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
          radius: Math.max(2, Math.sqrt(feature.properties.capacity_mw)/100), // min radius 2
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
