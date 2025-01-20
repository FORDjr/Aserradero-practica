// Tablas.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleTable from '../components/SimpleTable'
import SimpleLineChart from '../components/SimpleLineChart'
import FileUploadPopup from '../components/FileUploadPopup'
import '../styles/Tablas.css'

const Tablas = () => {
  const [tableData, setTableData] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  // Se llama cuando se lee el archivo en FileUploadPopup
  const handleFileRead = (data) => {
    console.log('[Tablas] handleFileRead, datos:', data)
    setTableData(data)
  }

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  return (
    <div className="main-tablas">
      {/* Encabezado con botones */}
      <div className="header-tablas">
        <h1>Panel de Datos</h1>
        <div className="header-buttons">
          <button className="primary-button" onClick={() => navigate('/')}>
            Volver
          </button>
          <button className="secondary-button" onClick={togglePopup}>
            Cargar datos
          </button>
        </div>
      </div>

      {showPopup && <FileUploadPopup onClose={togglePopup} onFileRead={handleFileRead} />}

      {/* Contenedor principal en Grid */}
      <div className="parent-grid">
        {/* Abajo a la izquierda (tabla) */}
        <div className="down-left-grid">
          <h3>+</h3>
          <SimpleTable data={tableData} />
        </div>

        {/* Gráfico 1: arriba a la derecha */}
        <div className="grafic-one">
          <SimpleLineChart data={tableData} />
        </div>

        {/* Gráfico 2: fila intermedia a la derecha */}
        <div className="grafic-two">
          <SimpleLineChart data={tableData} />
        </div>

        {/* Gráfico 3: fila inferior a la derecha */}
        <div className="grafic-three">
          <SimpleLineChart data={tableData} />
        </div>
      </div>
    </div>
  )
}

export default Tablas
