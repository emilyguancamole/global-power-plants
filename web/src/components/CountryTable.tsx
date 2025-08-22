import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { CountryCapacityType } from "../data/types";

type CountryTableProps = {
  data: CountryCapacityType[];
};

const CountryTable = ({ data }: CountryTableProps) => {
  // Datagrid row: key-value pairs that correspond to the column and its value
  const rows = data.map((country, index) => ({
    id: index,
    ...country,
  }));

  // DataGrid columns: `headerName` sets col name; `field` maps the column to its corresponding row values
  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "Rank",
      width: 37,
      type: "number",
      align: "left",
      headerAlign: "left",
      valueGetter: (_, row) => {
        return (
          data.findIndex(
            (country) => country.country_code === row.country_code,
          ) + 1
        );
      },
    },
    { 
      field: "country_name", 
      headerName: "Country", 
      width: 175,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "tot_capacity",
      headerName: "Capacity (MW)",
      type: "number",
      align: "left",
      headerAlign: "left",
      width: 110,
      valueFormatter: (val: number) => {
        return Math.round(val).toString();
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "93%",
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
        hideFooter
      />
    </Box>
  );
};

export default CountryTable;
