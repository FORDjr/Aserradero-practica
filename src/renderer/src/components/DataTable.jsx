import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'

const columns = [
  { field: 'id', headerName: 'Archivo', width: 150 },
  { field: 'dia', headerName: 'Día', width: 130 },
  { field: 'hora', headerName: 'Hora', width: 130 },
  { field: 'volt', headerName: 'Voltaje', width: 130 },
  { field: 'temp', headerName: 'Temperatura', width: 130 },
  { field: 'dist', headerName: 'Distancia', width: 130 }
]

export default function DataTable() {
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name) // Guardar el nombre del archivo
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n') // Dividir el contenido en líneas

      const newRows = lines
        .filter((line) => line.trim() !== '') // Ignorar líneas vacías
        .map((line, index) => {
          const [id, dia, hora, volt, temp, dist] = line
            .split(' ') 

          return {
            id: id || `row-${index}`,
            dia,
            hora,
            volt: parseFloat(volt),
            temp: parseFloat(temp),
            dist: parseFloat(dist)
          }
        })

      setRows(newRows) // Actualizar las filas en la tabla
    }

    reader.readAsText(file) // Leer el archivo como texto
  }

  return (
    <div style={{ padding: 20 }}>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      {fileName && <p>Archivo cargado: {fileName}</p>}

      <Paper sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 30]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  )
}
