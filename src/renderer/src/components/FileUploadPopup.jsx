// FileUploadPopup.jsx
import '../styles/FileUploadPopup.css'

const FileUploadPopup = ({ onClose, onFileRead }) => {
  const parseLine = (line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return null

    // Suponiendo el formato "2025-01-17 9:37:32 3,94"
    // o el formato con slash "2025/1/16 11:23:31 19.54"
    // Ajusta si lo necesitas más robusto.

    let datePart, timePart, currentPart

    if (trimmedLine.includes('/')) {
      // Formato: 2025/1/16 11:23:31 19.54
      const parts = trimmedLine.split(/[\s/]+/)
      if (parts.length < 5) return null
      const [year, month, day, time, corriente] = parts
      datePart = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      timePart = time
      currentPart = corriente
    } else {
      // Formato: 2025-01-17 9:37:38 13,81
      const parts = trimmedLine.split(/\s+/)
      if (parts.length < 3) return null
      const [date, time, corriente] = parts
      datePart = date
      timePart = time
      currentPart = corriente
    }

    // Convertir corriente
    const corrienteNum = parseFloat(currentPart.replace(',', '.'))
    if (isNaN(corrienteNum)) return null

    return {
      dia: datePart,
      hora: timePart,
      corriente: corrienteNum
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n').filter((line) => line.trim())

      // Parsear las líneas
      const parsedData = lines.map(parseLine).filter(Boolean)

      // Enviar datos al padre (sin procesar)
      onFileRead(parsedData)
    }
    reader.readAsText(file)
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Cargar archivo</h2>
        <input type="file" className="file-input" onChange={handleFileChange} />
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default FileUploadPopup
