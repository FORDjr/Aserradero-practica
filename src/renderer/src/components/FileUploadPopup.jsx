import React, { useState } from 'react'
import DragAndDrop from '../components/DragAndDrop'
import '../styles/FileUploadPopup.css'

const FileUploadPopup = ({ onClose, onFileRead }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileData, setFileData] = useState([])
  const [selectedType, setSelectedType] = useState('')

  const handleFileRead = (data) => {
    setFileData(data) // Guarda los datos procesados
  }

  const handleUpload = () => {
    if (fileData.length > 0 && selectedType) {
      const enrichedData = fileData.map((row) => ({
        Fecha: row.dia, // Asumiendo que "dia" es la fecha
        Hora: row.hora,
        Corriente: row.corriente
      }))

      onFileRead(enrichedData, selectedType)

      onClose() // Cierra el pop-up
    } else {
      alert('Por favor selecciona un archivo válido y un tipo.')
    }
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Subir Archivo</h2>
        <label>
          Seleccionar Tipo:
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">Selecciona...</option>
            <option value="volteo">Volteo</option>
            <option value="temperatura">Temperatura</option>
            <option value="distancia">Distancia</option>
          </select>
        </label>

        <DragAndDrop onFileRead={handleFileRead} />

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleUpload} style={{ marginRight: '10px' }}>
            Cargar
          </button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default FileUploadPopup
