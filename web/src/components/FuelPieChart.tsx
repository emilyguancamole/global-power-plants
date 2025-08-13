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
  Cell
} from "recharts";

const FuelPieChart = () => {
    const [fuelData, setFuelData] = useState<FuelShareType[]>([])

    useEffect(() => {
        fetchFuelShare().then((raw) => {
            const cleaned = raw.map((r: { tot_capacity: string; }) => ({
            ...r,
            tot_capacity: Number(
                typeof r.tot_capacity === 'string'
                ? r.tot_capacity.replace(/[, ]/g,'')
                : r.tot_capacity
            ) || 0
            }));
            setFuelData(cleaned);
        });
    }, []);
    

    return ( // create Cell components for each slice
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={fuelData}
                    dataKey="tot_capacity"
                    nameKey="primary_fuel"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ primary_fuel, percent = 0 }) => {
                        return percent > 0.03 ? `${primary_fuel} ${(percent * 100).toFixed(1)}%` : '';
                    }} // label for >3% of pie
                    labelLine={false}
                >
                    {fuelData.map((entry) => (
                        <Cell key={entry.primary_fuel} fill={FUEL_COLORS[entry.primary_fuel] || '#827eddff'} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number, name: string) => [
                        `${value.toFixed(0).toLocaleString()} MW`, name
                    ]}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
        
    )
}

export default FuelPieChart;