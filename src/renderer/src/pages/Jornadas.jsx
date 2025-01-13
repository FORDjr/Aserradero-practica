import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DragAndDrop from '../components/DragAndDrop'
import TablasSvgButton from '../assets/TablasSvgButton'
import '../styles/Jornadas.css'

const Jornadas = () => {
  const navigate = useNavigate()
  const [fileContent, setFileContent] = useState('')

  return (
    <main className="mainJornadas">
      <h1>ASERRADERO </h1>

      <div className="diaMT">
        <button onClick={() => navigate('/tablas')}>
          <span>TABLAS</span>
          <TablasSvgButton />
        </button>
      </div>
      <div className="sdCards">
        <div className="SDVolt">
          <h2>VOLTEOS</h2>
          <DragAndDrop
            onFileRead={(content) => setFileContent(content)} // Callback para actualizar el estado
          />
        </div>
        <div className="SDTemp">
          <h2>TEMPERATURA</h2>
          <DragAndDrop
            onFileRead={(content) => setFileContent(content)} // Callback para actualizar el estado
          />
        </div>
        <div className="SDDist">
          <h2>DISTANCIA</h2>
          <DragAndDrop
            onFileRead={(content) => setFileContent(content)} // Callback para actualizar el estado
          />
        </div>
      </div>

      <pre id="contenido">{fileContent}</pre>
    </main>
  )
}

export default Jornadas
