import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleTable from '../components/Table'
import SimpleLineChart from '../components/LineChart'
import FileUploadPopup from '../components/FileUploadPopup'
import DateFilter from '../components/DateFilter'
import '../styles/Tablas.css'

const Tablas = () => {
  const [tableData, setTableData] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [rawData, setRawData] = useState([])
  const [smoothValue, setSmoothValue] = useState(5)
  const [filters, setFilters] = useState({
    day: '',
    timeFrom: '',
    timeTo: ''
  })
  const navigate = useNavigate()

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }))
  }

  const smoothData = (data, windowSize = 5) => {
    if (!data || data.length === 0) return []
    if (windowSize === 0) return data
  
    const smoothed = data.map((row, index) => {
      const start = Math.max(0, index - Math.floor(windowSize / 2))
      const end = Math.min(data.length - 1, index + Math.floor(windowSize / 2))
      const windowSlice = data.slice(start, end + 1)
      const sum = windowSlice.reduce((acc, cur) => acc + cur.corriente, 0)
      const avg = sum / windowSlice.length
      return {
        ...row,
        corriente: avg
      }
    })
    return smoothed
  }
  
  const handleFileRead = (data) => {
    setRawData(data)
    // Si smoothValue es 0, usar datos sin procesar
    const processedData = smoothValue === 0 ? data : smoothData(data, smoothValue)
    setTableData(processedData)
  }

  const handleSmoothChange = (value) => {
    setSmoothValue(value)
    if (rawData.length > 0) {
      const smoothedData = smoothData(rawData, value)
      setTableData(smoothedData)
    }
  }

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      let matchesDay = true
      let matchesTimeRange = true

      if (filters.day) {
        matchesDay = row.dia === filters.day
      }

      if (filters.timeFrom || filters.timeTo) {
        // Separar hora:minuto:segundo de la hora actual
        const [h, m, s] = row.hora.split(':').map(Number)
        const rowDate = new Date(1970, 0, 1, h, m, s || 0).getTime()

        // Procesar hora inicial
        const [fromH, fromM, fromS = '0'] = (filters.timeFrom || '00:00:00').split(':')
        const fromDate = new Date(1970, 0, 1, +fromH, +fromM, +fromS).getTime()

        // Procesar hora final
        const [toH, toM, toS = '59'] = (filters.timeTo || '23:59:59').split(':')
        const toDate = new Date(1970, 0, 1, +toH, +toM, +toS).getTime()

        matchesTimeRange = rowDate >= fromDate && rowDate <= toDate
      }

      return matchesDay && matchesTimeRange
    })
  }, [tableData, filters])

  return (
    <div className="main-tablas">
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

      <DateFilter
        onFilterChange={handleFilterChange}
        smoothValue={smoothValue}
        onSmoothChange={handleSmoothChange}
      />
      <div className="parent-grid">
        <div className="down-left-grid">
          <SimpleTable data={filteredData} />
        </div>

        <div className="grafic-one">
          <SimpleLineChart data={filteredData} />
        </div>

        <div className="grafic-two">
          <SimpleLineChart data={filteredData} />
        </div>

        <div className="grafic-three">
          <SimpleLineChart data={filteredData} />
        </div>
      </div>
    </div>
  )
}

export default Tablas
