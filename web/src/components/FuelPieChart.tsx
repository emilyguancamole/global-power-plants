// Global Primary Fuel Pie Chart – A pie chart view that shows the share of global generating capacity by its primary fuel.
import { useEffect, useState } from "react";
import { FUEL_COLORS, type FuelShareType } from "@/data/types";
import { fetchFuelShare } from "@/data/api";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const FuelPieChart = () => {
  const [fuelData, setFuelData] = useState<FuelShareType[]>([]);

  useEffect(() => {
    fetchFuelShare().then((raw) => {
      const cleaned = raw.map((r: { tot_capacity: string }) => ({
        ...r,
        tot_capacity:
          Number(
            typeof r.tot_capacity === "string"
              ? r.tot_capacity.replace(/[, ]/g, "")
              : r.tot_capacity,
          ) || 0,
      }));
      setFuelData(cleaned);
    });
  }, []);

  return (
    // create Cell components for each slice
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={fuelData}
          dataKey="tot_capacity"
          nameKey="primary_fuel"
          cx="50%"
          cy="50%"
          outerRadius={120}
          // label={({ primary_fuel, percent = 0,x,y }) => {
          //     return percent > 0.03 ? (
          //         <text
          //     x={x}
          //     y={y+10}
          //     textAnchor="middle"
          //     dominantBaseline="central"
          //     fontSize={12}
          //     fill={FUEL_COLORS[primary_fuel]}
          // >
          //     {`${primary_fuel} ${(percent * 100).toFixed(1)}%`}
          // </text>

          //     ) : '';
          // }} // label for >3% of pie
          labelLine={false}
        >
          {fuelData.map((entry) => (
            <Cell
              key={entry.primary_fuel}
              fill={FUEL_COLORS[entry.primary_fuel] || "#827eddff"}
            />
          ))}
        </Pie>
        <Tooltip // percent formatting in tooltip
          formatter={(value: number, name: string) => {
            const total = fuelData.reduce(
              (sum, entry) => sum + entry.tot_capacity,
              0,
            );
            const percent = total > 0 ? (value / total) * 100 : 0;
            return [`${percent.toFixed(1)}%`, name];
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: "0.8rem",
            padding: 0,
            margin: 0,
            lineHeight: "1.2",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FuelPieChart;
