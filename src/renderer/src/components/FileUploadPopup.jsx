import '../styles/FileUploadPopup.css'

const FileUploadPopup = ({ onClose, onFileRead }) => {
  const parseLine = (line) => {
    // Remover espacios extras
    const trimmedLine = line.trim()
    
    // Intentar parsear ambos formatos
    let parts
    if (trimmedLine.includes('/')) {
      // Formato: 2025/1/16 11:23:31 19.54
      parts = trimmedLine.split(/[\s/]+/)
      const [year, month, day, time, current] = parts
      return {
        dia: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        hora: time,
        corriente: parseFloat(current.replace(',', '.'))
      }
    } else {
      // Formato: 2025-01-17 9:37:38 13,81
      const [dateStr, timeStr, currentStr] = trimmedLine.split(' ')
      return {
        dia: dateStr,
        hora: timeStr,
        corriente: parseFloat(currentStr.replace(',', '.'))
      }
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
  
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n').filter((line) => line.trim()).slice(1)
  
      const data = lines
        .map((line) => {
          try {
            return parseLine(line)
          } catch (error) {
            console.error('Error parsing line:', line, error)
            return null
          }
        })
        .filter(Boolean)
  
      console.log('[FileUploadPopup] Datos parseados:', data)
      onFileRead(data)
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
