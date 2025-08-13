import "./App.css";
import React, { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import Map from "@/components/Map";
import CountryTable from "@/components/CountryTable";
import SelectCountries from "@/components/SelectCountries";
import CountryGenerationChart from "@/components/CountryGenerationChart";
import FuelPieChart from "./components/FuelPieChart";

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
//todo tab for form?

function App() {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  
  const dashboardContent = (
    <div>
      {/* Row 1 */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '70% 30%' },
          gridTemplateRows: { xs:'auto', lg:'500px'}, // 2 rows, set responsive height
          gap: 2, // spacing between grid items
          mb: 8   // margin bottom
        }}
      >

        {/* Map */}
        <Box sx={{ 
          display: 'flex', // flexcolumn
          flexDirection: 'column',
          height: '100%',
          minHeight: 0, // let it shrink
          boxShadow: 1, 
          borderRadius: 1, 
          p: 2,
          overflow: 'hidden' //? auto for scroll?
          }}
        >
          <Typography variant="h5" gutterBottom>
            Power Plant Map
          </Typography>
          <Map />
        </Box>

        {/* Country Table */}
        <Box sx={{ 
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          boxShadow: 1, 
          borderRadius: 1, 
          p: 2,
          overflow: "hidden"
          }}
        >
          <Typography variant="h5" gutterBottom>
            Top 25 Countries by Capacity
          </Typography>
          <CountryTable />
        </Box>
      </Box>

      {/* Row 2 */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '50% 50%' },
          gridTemplateRows: { xs:'auto', lg:'500px'},
          mb: 8
        }}
      >
          {/* Pie Chart */} 
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            gridColumn: { xs: '1', lg: '1 / 2' },
            boxShadow: 1, 
            borderRadius: 1, 
            p: 2 
          }}
        >
          <Typography variant="h5" gutterBottom>
            Fuel Distribution
          </Typography>
          <FuelPieChart />
          </Box>

          {/* Generation Chart */}
          <Box 
            sx={{ 
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
              gridColumn: { xs: '1', lg: '2 / 3' }, 
              boxShadow: 1, 
              borderRadius: 1, 
              p: 2 
            }}
          >
          <Typography variant="h5" gutterBottom>
            Generation Over Time
          </Typography>
          <SelectCountries 
            selectedCountries={selectedCountries} 
            setSelectedCountries={setSelectedCountries} 
          /> 
          <CountryGenerationChart selectedCountries={selectedCountries} />
        </Box>
      </Box>
    </div>
  )
      
      
        
    
  
return (
  <Container>
    <Tabs value={tabIndex} onChange={handleTabChange} centered>
      <Tab label="All" />
      <Tab label="Power Plant Map" />
      <Tab label="Country Table" />
      <Tab label="Generation Over Time" />
      <Tab label="Fuel Pie Chart" />
    </Tabs>
    <Typography variant="h3" align="center" gutterBottom>
      Global Power Dashboard
    </Typography>
  </Container>
);
}
export default App;
