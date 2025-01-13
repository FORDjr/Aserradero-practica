import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: 'dia', headerName: 'Día', width: 130 },
  { field: 'hora', headerName: 'Hora', width: 130 },
  { field: 'corriente', headerName: 'Corriente', width: 130 },
];




export default function DataTable({ data }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    console.log("DataTable recibió datos:", data);
    if (data.length > 0) {
      const newRows = data.map((item, index) => ({
        id: item.id || index,
        dia: item.dia || "N/A",
        hora: item.hora || "N/A",
        corriente: item.corriente || 0,
      }));
      setRows(newRows);
    }
  }, [data]);
  
  
  

  return (
    <div style={{ padding: 20 }}>
      <Paper sx={{ height: 400, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 30]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
