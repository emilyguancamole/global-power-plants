//  Create a line chart that shows the annual
// electricity generation for one or more selected countries based on the available
// dataset. The chart should automatically update whenever the selected country or
// countries change. Users must be able to select up to two countries for comparison.

import { useEffect, useState } from "react";
import type {
  GenerationOverTimeType,
  GenerationChartDataPoint,
} from "@/data/types";
import { fetchGenerationOverTime } from "@/data/api";
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
};

const CountryGenerationChart = ({
  selectedCountries,
}: CountryGenerationChartProps) => {
  const [chartData, setChartData] = useState<GenerationChartDataPoint[]>([]);

  const countriesToShow =
    selectedCountries && selectedCountries.length > 0
      ? selectedCountries
      : ["USA", "CAN"];

  useEffect(() => {
    const dataObj: Record<string, GenerationOverTimeType[]> = {}; //* countrycode->[{2003,year_gen}, {2004,year_gen}, ...]
    const fetchAll = async () => {
      for (const code of countriesToShow) {
        //* "of" to loop thru values
        try {
          const data = await fetchGenerationOverTime(code);
          dataObj[code] = data;
        } catch (err) {
          console.log(`Error fetching country gen data for ${code}: ${err}`);
          dataObj[code] = [];
        }
      }
      const formattedData = formatGenerationData(dataObj); //* [ {2010, USA:200, CAN: 100}, {2011, ...}... ]
      setChartData(formattedData);
    };
    fetchAll();
  }, [selectedCountries]);

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
          // todo align label in center of yaxis
          label={{
            value: "Generation (TWh)",
            angle: -90,
            position: "insideLeft",
            fontSize: 12,
          }}
        />
        <Tooltip />
        <Legend />
        {countriesToShow.map((code, idx) => (
          <Line
            key={code}
            type="monotone"
            dataKey={code}
            stroke={idx === 0 ? "#84d0d8ff" : "#2eba0fff"}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatGenerationData(
  dataObj: Record<string, GenerationOverTimeType[]>,
): GenerationChartDataPoint[] {
  const yearToGenData: Record<number, GenerationChartDataPoint> = {}; //* year: {year, USA: 200, CAN: 100}
  Object.entries(dataObj).forEach(([code, data]) => {
    data.forEach(({ year, yearly_generation }) => {
      if (!yearToGenData[year]) {
        yearToGenData[year] = { year }; // initialize the year entry with the year
      }
      yearToGenData[year][code] = yearly_generation ?? null; // add generation data for the country to the year entry
    });
  });
  return Object.values(yearToGenData).sort((a, b) => a.year - b.year); //* extract only the values (GenerationOverTime); sort by each object's year; smaller number first
}

export default CountryGenerationChart;
