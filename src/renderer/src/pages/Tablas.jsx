// Tablas.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleTable from '../components/Table'
import SimpleLineChart from '../components/LineChart'
import FileUploadPopup from '../components/FileUploadPopup'
import DateFilter from '../components/DateFilter'
import '../styles/Tablas.css'

// Nuevas funciones:
import { lowPassFilter, detectTablasYcortes } from '../utils/filterAndDetect'

const Tablas = () => {
  const [tableData, setTableData] = useState([])
  const [tablas, setTablas] = useState([]) // aquí guardamos la info de inicio/fin de tablas/cortes

  const [showPopup, setShowPopup] = useState(false)
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

  // Al subir el archivo, aplicamos:
  // 1) Filtro lowpass
  // 2) Detectar tablas/cortes => guardamos el array anotado en tableData
  // 3) Guardamos la info de tablas en setTablas
  const handleFileRead = (rawData) => {
    // 1) Filtro
    const alpha = 0.05
    const filtrados = lowPassFilter(rawData, alpha)
  
    // 2) Detección
    const { annotatedData, tablas } = detectTablasYcortes(filtrados)
  
    setTableData(annotatedData)
    setTablas(tablas)
  }

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      let matchesDay = true
      let matchesTimeRange = true

      if (filters.day) {
        matchesDay = row.dia === filters.day
      }

      if (filters.timeFrom || filters.timeTo) {
        const [h, m, s] = row.hora.split(':').map(Number)
        const rowDate = new Date(1970, 0, 1, h, m, s || 0).getTime()

        const [fromH, fromM, fromS = '0'] = (filters.timeFrom || '00:00:00').split(':')
        const fromDate = new Date(1970, 0, 1, +fromH, +fromM, +fromS).getTime()

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
      <DateFilter onFilterChange={handleFilterChange} />
      <div className="parent-grid">
        <div className="down-left-grid">
          <SimpleTable data={filteredData} />
        </div>
        <div className="grafic-one">
          {/* Graficar corrienteFiltrada para ver el efecto del filtro y el estado */}
          <SimpleLineChart data={filteredData} yKey="corrienteFiltrada" />
        </div>
        <div className="grafic-two">
          {/* Si quieres comparar vs la señal bruta */}
          <SimpleLineChart data={filteredData} yKey="corriente" />
        </div>
        <div className="grafic-three">
          {/* Otra vista de la corriente filtrada o tu preferencia */}
          <SimpleLineChart data={filteredData} yKey="corrienteFiltrada" />
        </div>
      </div>
      <h2>Resumen de Tablas y Cortes</h2>
      <div style={{ margin: '1rem' }}>
        {tablas.length === 0 ? (
          <p>No hay tablas detectadas</p>
        ) : (
          tablas.map((t) => {
            const tablaHoraInicio = filteredData[t.startIndex]?.hora || ''
            const tablaHoraFin = filteredData[t.endIndex]?.hora || ''

            return (
              <div
                key={t.tablaId}
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  border: '2px solid #0069d9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <h3 style={{ marginBottom: '1rem', color: '#0069d9' }}>
                  TABLA #{t.tablaId} (hora inicio: {tablaHoraInicio} - hora fin: {tablaHoraFin})
                </h3>

                {t.cortes.length === 0 ? (
                  <p>No se detectaron cortes en esta tabla</p>
                ) : (
                  <div style={{ marginLeft: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>Cortes detectados:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {t.cortes.map((c) => {
                        const corteHoraInicio = filteredData[c.startIndex]?.hora || ''
                        const corteHoraFin = filteredData[c.endIndex]?.hora || ''

                        return (
                          <li
                            key={c.corteId}
                            style={{
                              marginBottom: '0.5rem',
                              padding: '0.75rem',
                              backgroundColor: '#fff',
                              borderRadius: '4px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              borderLeft: '3px solid #28a745'
                            }}
                          >
                            CORTE #{c.corteId} (hora inicio: {corteHoraInicio} - hora fin:{' '}
                            {corteHoraFin})
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Tablas
