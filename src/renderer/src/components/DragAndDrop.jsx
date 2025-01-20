import React, { useState } from 'react'
import '../styles/DragAndDrop.css'

const DragAndDrop = ({ onFileRead }) => {
  const [dragging, setDragging] = useState(false)

  // Función para parsear y formatear cada línea, agregando milisegundos
  const parseAndFormatLines = (lines) => {
    let lastKey = null   // Para identificar el "año-mes-día-hora-minuto-segundo"
    let repeatCount = 0  // Cuántas veces hemos visto el mismo segundo

    return lines.map((line) => {
      // 1. Dividimos la línea en sus 3 partes: "YYYY/M/D", "H:M:S", "corriente"
      const [rawDate, rawTime, rawCurrent] = line.trim().split(/\s+/)

      if (!rawDate || !rawTime || !rawCurrent) {
        console.warn(`Línea ignorada (mal formateada): ${line}`)
        return null
      }

      // 2. Parseamos fecha: "YYYY/M/D"
      const [yearStr, monthStr, dayStr] = rawDate.split('/')
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)
      const day = parseInt(dayStr, 10)

      // 3. Parseamos hora: "H:M:S"
      const [hourStr, minuteStr, secondStr] = rawTime.split(':')
      const hour = parseInt(hourStr, 10)
      const minute = parseInt(minuteStr, 10)
      const second = parseInt(secondStr, 10)

      // 4. Generamos la llave para ese segundo
      //    (año, mes, día, hora, minuto, segundo) sin ceros a la izquierda
      const key = `${year}-${month}-${day}-${hour}-${minute}-${second}`

      if (key === lastKey) {
        repeatCount++
      } else {
        repeatCount = 0
        lastKey = key
      }

      // 5. Calculamos milisegundos = repeatCount * 10
      //    La primera vez que vemos un segundo, milisegundos = 0
      //    La segunda, 10; la tercera, 20; etc.
      const ms = repeatCount * 10

      // 6. Formateamos todos los componentes con ceros a la izquierda
      //    Para que queden en estilo YYYY/MM/DD HH:MM:SS.mmm
      const fYear = String(year)
      const fMonth = String(month).padStart(2, '0')
      const fDay = String(day).padStart(2, '0')
      const fHour = String(hour).padStart(2, '0')
      const fMinute = String(minute).padStart(2, '0')
      const fSecond = String(second).padStart(2, '0')
      const fMs = String(ms).padStart(3, '0')

      // 7. Construimos los campos "dia" y "hora" finales
      const dia = `${fYear}/${fMonth}/${fDay}`
      const hora = `${fHour}:${fMinute}:${fSecond}.${fMs}`

      // 8. Convertimos la corriente a número (float)
      const corriente = parseFloat(rawCurrent)

      // Retornamos un objeto con la estructura que usas en Tablas.jsx
      return { dia, hora, corriente }
    }).filter(Boolean) // Eliminamos los nulos (líneas mal formateadas)
  }

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

  // Lectura del archivo .txt
  const readFile = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // 1. Obtenemos todo el contenido como string
        const content = e.target.result

        // 2. Separamos en líneas no vacías
        const lines = content.split('\n').filter((line) => line.trim())

        // 3. Llamamos a la función que parsea y formatea con milisegundos
        const formattedData = parseAndFormatLines(lines)

        console.log('Datos procesados + milisegundos:', formattedData)

        // 4. Enviamos el array final a onFileRead
        if (onFileRead) {
          onFileRead(formattedData)
        }
      }
      reader.readAsText(file)
    }
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
