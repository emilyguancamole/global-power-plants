import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import Map from "@/components/Map";
import CountryTable from "@/components/CountryTable";
import SelectCountries from "@/components/SelectCountries";
import CountryGenerationChart from "@/components/CountryGenerationChart";
import FuelPieChart from "@/components/FuelPieChart";
import UpdateForm from "@/components/UpdateForm";
import { fetchGenerationOverTime, fetchTop25 } from "./data/api";
import type { CountryCapacityType, GenerationOverTimeType } from "@/data/types";

function App() {
  // countries to display in generation chart
  const [selectedDisplayCountries, setSelectedDisplayCountries] = useState<string[]>(["USA", "CAN"]);
  // for update form
  const [updateType, setUpdateType] = useState<
    "capacity" | "generation" | null
  >(null);
  const [selectedUpdateCountry, setSelectedUpdateCountry] = useState<string>();
  const [updateYear, setUpdateYear] = useState<number | null>(null); // for generation data only
  const [updateValue, setUpdateValue] = useState<number | null>(null);

  // Fetching and state for generation chart & capacity table data lifted up for auto updates after updates to update form
  const [top25Data, setTop25Data] = useState<CountryCapacityType[]>([]); 
  const [generationData, setGenerationData] = useState<Record<string, GenerationOverTimeType[]>>({}); // {countrycode -> gen data}

  const refetchTop25Data = useCallback(async () => {
    const data = await fetchTop25();
    setTop25Data(data);
  }, []);

  const refetchGenerationData = useCallback(async (countries: string[]) => {
    const newData: Record<string, GenerationOverTimeType[]> = {};
    for (const code of countries) {
      newData[code] = await fetchGenerationOverTime(code);
    }
    setGenerationData(newData);
  }, []);
     
  // Initial fetches
  useEffect(() => {
    refetchTop25Data();
  }, [refetchTop25Data]); 

  useEffect(() => {
    if (selectedDisplayCountries.length > 0) {
      refetchGenerationData(selectedDisplayCountries);
    }
  }, [selectedDisplayCountries, refetchGenerationData]); //* call when selected countries changes

  // Main dashboard content
  const dashboardContent = (
    <div>
      {/* Row 1 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "70% 30%" },
          gridTemplateRows: { xs: "auto", lg: "500px" }, // 2 rows, set responsive height
          gap: 1, // spacing between grid items
          mb: 2, // margin bottom
        }}
      >
        {/* Map */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 300,
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
            overflow: "hidden", 
          }}
        >
          <Typography variant="h5" gutterBottom>
            Power Plant Map
          </Typography>
          <Map />
        </Box>

        {/* Pie Chart */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 350,
            gridColumn: { xs: "1", lg: "2 " },
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Fuel Distribution
          </Typography>
          <FuelPieChart />
        </Box>
      </Box>

      {/* Row 2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "32% 46% 22%" },
          gridTemplateRows: { xs: "auto", lg: "500px" },
          gap: 1,
          mb: 4,
        }}
      >
        {/* Country Table */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 100,
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
            overflow: "hidden",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Top 25 Countries by Capacity
          </Typography>
          <CountryTable data={top25Data}/>
        </Box>
        {/* Generation Chart */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 300,
            gridColumn: { xs: "1", lg: "2" },
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Generation Over Time
          </Typography>
          <Box sx={{ mb: 3 }}>
            <SelectCountries
              selectedCountries={selectedDisplayCountries}
              setSelectedCountries={setSelectedDisplayCountries}
            />
          </Box>
          <CountryGenerationChart
            selectedCountries={selectedDisplayCountries}
            generationData={generationData}
          />
        </Box>
        
        {/* Edit form */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 300,
            gridColumn: { xs: "1", lg: "3" },
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Update Country Data
          </Typography>
          <UpdateForm
            updateType={updateType}
            setUpdateType={setUpdateType}
            selectedUpdateCountry={selectedUpdateCountry!} // non-null assertion operator
            setSelectedUpdateCountry={setSelectedUpdateCountry}
            updateYear={updateYear!}
            setUpdateYear={setUpdateYear}
            updateValue={updateValue!}
            setUpdateValue={setUpdateValue}
            onDataUpdated={() => { // callback after data updated, refresh data/update state in App
              refetchTop25Data();
              refetchGenerationData(selectedDisplayCountries);
            }}
          />
        </Box>
      </Box>
    </div>
  );

  return (
    <Container>
      <Typography sx={{ mt: 4 }} variant="h1" align="center" gutterBottom>
        Global Power Plants Dashboard
      </Typography>

      <Box>{dashboardContent}</Box>
    </Container>
  );
}
export default App;



/*
Note on grid positioning:
  gridColumn Values:
  '1' = occupies column 1 only
  '1 / 2' = starts at line 1, ends at line 2 (occupies column 1)
  '2 / 3' = starts at line 2, ends at line 3 (occupies column 2)
  '1 / -1' = spans from first to last column (full width)
  gridRow Values:
  '1' = occupies row 1
  '2' = occupies row 2
  '1 / 3' = spans rows 1 and 2
*/