import { useEffect, useState } from "react";
import { fetchTop25 } from "../data/api";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { CountryCapacityType } from "../data/types";

const CountryTable = () => {
  const [countries, setCountries] = useState<CountryCapacityType[]>([]);

  useEffect(() => {
    fetchTop25()
      .then((data: CountryCapacityType[]) => {
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          setCountries([]);
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching top countries:", error));
  }, []);

  // Datagrid row: key-value pairs that correspond to the column and its value
  const rows = countries.map((country, index) => ({
    // assign an index to each `country` item
    id: index,
    ...country,
  }));

  // DataGrid columns: `headerName` sets col name; `field` maps the column to its corresponding row values
  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "Rank",
      width: 80,
      type: "number",
      valueGetter: (_, row) => {
        return (
          countries.findIndex(
            (country) => country.country_code === row.country_code,
          ) + 1
        );
      },
    },
    // { field: "country_code", headerName: "Code", width: 100 },
    { field: "country_name", headerName: "Country", width: 180 },
    {
      field: "tot_capacity",
      headerName: "Total Capacity (MW)",
      type: "number",
      width: 150,
      valueFormatter: (val: number) => {
        return Math.round(val).toString();
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "95%",
        width: "100%",
        "& .MuiDataGrid-row:nth-of-type(even)": {
          backgroundColor: "#f5f5f5", // stripes: gray for even rows
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#e3f2fd", // hover light blue
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
    </Box>
  );
};

export default CountryTable;
