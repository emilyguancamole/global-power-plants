import "./App.css";

import React from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import Map from "./components/Map";
// import CountryTable from './components/CountryTable';
// import GenerationChart from './components/GenerationChart';
// import FuelPieChart from './components/FuelPieChart';

function App() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newIndex: number) => { // MUI tabls onChange typing
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
        {tabIndex === 0 && <Map />}
        {tabIndex === 1 && <Map />}
        {/* {tabIndex === 1 && <CountryTable />}
        {tabIndex === 2 && <GenerationChart />}
        {tabIndex === 3 && <FuelPieChart />} */}
      </Box>
    </Container>
  );
}

export default App;
