import { useEffect, useState } from "react";
import type {
  GenerationOverTimeType,
  GenerationChartDataPoint,
} from "@/data/types";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CountryGenerationChartProps = {
  selectedCountries: string[] | null;
  generationData: Record<string, GenerationOverTimeType[]>;
};

const CountryGenerationChart = ({
  selectedCountries,
  generationData,
}: CountryGenerationChartProps) => {
  const [chartData, setChartData] = useState<GenerationChartDataPoint[]>([]);

  const countriesToShow =
    selectedCountries && selectedCountries.length > 0
      ? selectedCountries
      : ["USA", "CAN"];

  useEffect(() => {
    const filteredData: Record<string, GenerationOverTimeType[]> = {};
    for (const code of countriesToShow) {
      filteredData[code] = generationData[code] || [];
    }
    const formattedData = formatGenerationData(generationData); //* [ {2010, USA:200, CAN: 100}, {2011, ...}... ]
    setChartData(formattedData);
  }, [selectedCountries, generationData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            value >= 1000 ? `${value / 1000}` : value.toString()
          } // changed unit from gwh to twh
          label={{
            value: "Generation (TWh)",
            angle: -90,
            position: "insideLeft",
            fontSize: 12,
            dy: 50,
          }}
        />
        <Tooltip />
        <Legend />
        {countriesToShow.map((code, idx) => (
          <Line
            key={code}
            type="monotone"
            dataKey={code}
            stroke={idx === 0 ? "#088bb3ff" : "#29ae0bff"}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatGenerationData(
  dataObj: Record<string, GenerationOverTimeType[]>,
): GenerationChartDataPoint[] {
  const yearToGenData: Record<number, GenerationChartDataPoint> = {};
  Object.entries(dataObj).forEach(([code, data]) => {
    data.forEach(({ year, yearly_generation }) => {
      if (!yearToGenData[year]) {
        yearToGenData[year] = { year }; // initialize the year entry with the year
      }
      yearToGenData[year][code] = yearly_generation ?? null; // add generation data for the country to the year entry
    });
  });
  return Object.values(yearToGenData).sort((a, b) => a.year - b.year);
}

export default CountryGenerationChart;
