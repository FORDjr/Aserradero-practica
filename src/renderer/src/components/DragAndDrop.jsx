import React, { useState } from 'react'
import Papa from 'papaparse' // Importamos papaparse
import '../styles/DragAndDrop.css' // Agrega estilos específicos si es necesario

const DragAndDrop = ({ onFileRead }) => {
  const [dragging, setDragging] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    readFile(file)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    readFile(file)
  }

  const readFile = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result

        Papa.parse(content, {
          delimiter: ' ',
          complete: (result) => {
            // Omitir la primera línea (encabezado)
            const rows = result.data.slice(1)
            
            console.log('Datos procesados del archivo:', rows)

            const formattedData = rows.map((row) => ({
              dia: row[0]?.trim() || 'N/A',
              hora: row[1]?.trim() || 'N/A',
              corriente: parseFloat(row[2]) || 0
            }))

            if (onFileRead) {
              onFileRead(formattedData)
            }
          },
          skipEmptyLines: true
        })
      }
      reader.readAsText(file)
    }
  }

  // Convertir .txt a CSV (esto depende del formato del .txt)
  const convertTextToCSV = (text) => {
    let lines = text.split('\n')
    let csv = lines
      .map((line) => {
        return line.split(/\s+/).join(',') // Separar por cualquier espacio y unir con comas
      })
      .join('\n')

    return csv
  }

  return (
    <div
      className={`cargar ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <form className="file-upload-form">
        <label className="file-upload-label" htmlFor="file">
          <div className="file-upload-design">
            <p>Arrastra tu archivo .txt aquí</p>
            <p>o</p>
            <span className="browse-button">Buscar archivo</span>
          </div>
          <input type="file" id="file" onChange={handleFileChange} />
        </label>
      </form>
    </div>
  )
}

export default DragAndDrop
