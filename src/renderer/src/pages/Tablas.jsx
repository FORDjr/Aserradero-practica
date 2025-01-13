import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import ChartGrafic from '../components/Chart'
import FileUploadPopup from '../components/FileUploadPopup'
import '../styles/Tablas.css'

const Tablas = () => {
  const [tableData, setTableData] = useState({}) // Almacena los datos combinados por día y hora
  const [selectedType, setSelectedType] = useState('') // Para controlar el tipo
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)

  const mergeData = (newData, type) => {
    const updatedData = { ...tableData };
  
    newData.forEach((row) => {
      const key = `${row.dia} ${row.hora}`;
      if (!updatedData[key]) {
        updatedData[key] = { dia: row.dia, hora: row.hora };
      }
      updatedData[key].corriente = row.corriente;
    });
  
    console.log('Datos combinados en tableData:', updatedData);
    setTableData(updatedData);
  }
  

  const handleFileRead = (data, type) => {
    console.log("handleFileRead:", data, type)
    setSelectedType(type)
    const parsedData = data.map((row) => ({
      dia: row.Fecha,
      hora: row.Hora,
      corriente: row.Corriente
    }))
    mergeData(parsedData, type)
  }
  

  const togglePopup = () => {
    setShowPopup((prev) => !prev)
  }

  // Convertimos `tableData` a un array para la tabla
  const tableRows = Object.values(tableData)

  return (
    <div className="mainTablas">
      <div className="parent">
        <div className="upLeftGrid">
          <button onClick={() => navigate('/')}>Volver a la página principal</button>
          <button onClick={togglePopup}>Abrir Pop-Up</button>
          {showPopup && <FileUploadPopup onClose={togglePopup} onFileRead={handleFileRead} />}
        </div>

        <div className="downLeftGrid">
          <DataTable data={tableRows} />
        </div>

        <div className="GraficOne">
          <ChartGrafic data={tableRows} type={selectedType} />
        </div>

        <div className="GraficTwo">
          <ChartGrafic />
        </div>

        <div className="GraficThree">
          <ChartGrafic />
        </div>

      </div>
    </div>
  )
}

export default Tablas
