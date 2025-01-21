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
  const [filters, setFilters] = useState({
    day: '',
    timeFrom: '',
    timeTo: ''
  })
  const navigate = useNavigate()

  const handleFileRead = (data) => {
    setTableData(data)
  }

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      let matchesDay = true
      let matchesTimeRange = true
  
      if (filters.day) {
        matchesDay = row.dia === filters.day
      }
  
      if (filters.timeFrom || filters.timeTo) {
        const [h, m, s] = row.hora.split(':')
        const rowDate = new Date(1970, 0, 1, +h, +m, s ? +s : 0).getTime()
  
        const [fromH, fromM] = (filters.timeFrom || '00:00').split(':')
        const fromDate = new Date(1970, 0, 1, +fromH, +fromM, 0).getTime()
  
        const [toH, toM] = (filters.timeTo || '23:59').split(':')
        const toDate = new Date(1970, 0, 1, +toH, +toM, 59).getTime()
  
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

      <DateFilter onFilterChange={handleFilterChange} />

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
