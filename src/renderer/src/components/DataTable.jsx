import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'dia', headerName: 'Día', width: 150 },
  { field: 'hora', headerName: 'Hora', width: 150 },
  { field: 'corriente', headerName: 'Corriente', width: 150 },
];

export default function DataTable({ data }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const newRows = data.map((item, index) => ({
        id: index,
        dia: item.dia || 'N/A',
        hora: item.hora || 'N/A',
        corriente: item.corriente || 0,
      }));
      setRows(newRows);
    }
  }, [data]);

  return (
    <div style={{ padding: 20 }}>
      <Paper sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Paper>
    </div>
  );
}
