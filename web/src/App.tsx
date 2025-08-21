import "./App.css";
import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import Map from "@/components/Map";
import CountryTable from "@/components/CountryTable";
import SelectCountries from "@/components/SelectCountries";
import CountryGenerationChart from "@/components/CountryGenerationChart";
import FuelPieChart from "@/components/FuelPieChart";
import UpdateForm from "@/components/UpdateForm";

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

//todo: theme

function App() {
  // const [tabIndex, setTabIndex] = useState<number>(0);

  // countries to display in generation chart
  const [selectedDisplayCountries, setSelectedDisplayCountries] = useState<
    string[]
  >([]);
  // for update form
  const [updateType, setUpdateType] = useState<
    "capacity" | "generation" | null
  >(null);
  const [selectedUpdateCountry, setSelectedUpdateCountry] = useState<string>();
  const [updateYear, setUpdateYear] = useState<number | null>(null); // for generation data only
  const [updateValue, setUpdateValue] = useState<number | null>(null);

  const dashboardContent = (
    <div>
      {/* Row 1 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "70% 30%" },
          gridTemplateRows: { xs: "auto", lg: "500px" }, // 2 rows, set responsive height
          gap: 1, // spacing between grid items
          mb: 4, // margin bottom
        }}
      >
        {/* Map */}
        <Box
          sx={{
            display: "flex", // flexcolumn
            flexDirection: "column",
            height: "100%",
            minHeight: 0, // let it shrink
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
            overflow: "hidden", //? auto for scroll?
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
            minHeight: 0,
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
          gap: 1,
          gridTemplateColumns: { xs: "1fr", lg: "40% 60%" },
          gridTemplateRows: { xs: "auto", lg: "500px" },
          mb: 4,
        }}
      >
        {/* Country Table */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
            overflow: "hidden",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Top 25 Countries by Capacity
          </Typography>
          <CountryTable />
        </Box>
        {/* Generation Chart */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            gridColumn: { xs: "1", lg: "2 / 3" },
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
          />
        </Box>
      </Box>

      {/* Row 3 */}
      <Box
        sx={{
          display: "grid",
          gap: 1,
          // gridTemplateColumns: { xs: '1fr', lg: '40% 60%' },
          gridTemplateRows: { xs: "auto", lg: "500px" },
          mb: 4,
        }}
      >
        {/* Edit form */}
        <UpdateForm
          updateType={updateType}
          setUpdateType={setUpdateType}
          selectedUpdateCountry={selectedUpdateCountry!} // non-null assertion operator
          setSelectedUpdateCountry={setSelectedUpdateCountry}
          updateYear={updateYear!}
          setUpdateYear={setUpdateYear}
          updateValue={updateValue!}
          setUpdateValue={setUpdateValue}
        />
      </Box>
    </div>
  );

  return (
    <Container>
      <Typography sx={{ mt: 4 }} variant="h3" align="center" gutterBottom>
        Global Power Dashboard
      </Typography>

      <Box>{dashboardContent}</Box>
    </Container>
  );
}
export default App;
