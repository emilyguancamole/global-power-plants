import "./App.css";
import React, { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import Map from "./components/Map";
import CountryTable from "./components/CountryTable";
import SelectCountries from "./components/SelectCountries";

function App() {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Global Power Dashboard
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="All" />
        <Tab label="Power Plant Map" />
        <Tab label="Country Table" />
        <Tab label="Generation Over Time" />
        <Tab label="Fuel Pie Chart" />
      </Tabs>
      <Box mt={4}>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Power Plant Map
            </Typography>
            <Map />
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Top 25 Countries by Capacity
            </Typography>
            <CountryTable />
          </Box>
        )}
        {tabIndex === 1 && <Map />}
        {tabIndex === 2 && <CountryTable />}
        {tabIndex === 3 &&
          <div>
            <SelectCountries selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} /> 
          </div>
        }
        {/* {tabIndex === 4 && <FuelPieChart />} */}
      </Box>
    </Container>
  );
}

export default App;
