// FileUploadPopup.jsx
import '../styles/FileUploadPopup.css'

const FileUploadPopup = ({ onClose, onFileRead }) => {

  const parseLine = (line) => {
    const trimmedLine = line.trim()
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

  /**
   * Función de suavizado (moving average).
   * windowSize controla la cantidad de muestras a promediar alrededor de cada punto.
   */
  const smoothData = (data, windowSize = 5) => {
    if (!data || data.length === 0) return []

    const smoothed = data.map((row, index) => {
      // Determinar inicio y fin de la ventana de promediado
      const start = Math.max(0, index - Math.floor(windowSize / 2))
      const end = Math.min(data.length - 1, index + Math.floor(windowSize / 2))

      // Tomar el subconjunto de filas dentro de esa ventana
      const windowSlice = data.slice(start, end + 1)

      // Calcular la media de corriente
      const sum = windowSlice.reduce((acc, cur) => acc + cur.corriente, 0)
      const avg = sum / windowSlice.length

      // Retornar un nuevo objeto con la corriente suavizada
      return {
        ...row,
        corriente: avg
      }
    })
    return smoothed
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content
        .split('\n')
        .filter((line) => line.trim())
        .slice(1)

      // Parsear datos sin aplicar suavizado
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

      // Enviar los datos sin procesar
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
