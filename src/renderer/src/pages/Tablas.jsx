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

// Función para convertir 'hora' a timestamp (segundos desde medianoche)
const parseHoraToTimestamp = (hora) => {
  const [h, m, s] = hora.split(':').map(Number)
  return h * 3600 + m * 60 + (s || 0)
}

const Tablas = () => {
  const [tableData, setTableData] = useState([])
  const [tablas, setTablas] = useState([])
  const [umbralOFF, setUmbralOFF] = useState(null)
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
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  // Al subir el archivo, aplicamos:
  // 1) Filtro lowpass
  // 2) Detectar tablas/cortes => guardamos el array anotado en tableData
  // 3) Guardamos la info de tablas en setTablas
  const handleFileRead = (rawData) => {
    // 1) Filtro
    const alpha = 0.08
    const filtrados = lowPassFilter(rawData, alpha)

    // 2) Detección
    const { annotatedData, tablas: tablasDetectadas, THRESH_OFF } = detectTablasYcortes(filtrados)

    // Añadir timestamp a cada fila
    const annotatedDataWithTimestamp = annotatedData.map((row) => ({
      ...row,
      timestamp: parseHoraToTimestamp(row.hora)
    }))

    setTableData(annotatedDataWithTimestamp)
    setTablas(tablasDetectadas)
    setUmbralOFF(THRESH_OFF)
  }

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      let matchesDay = true
      let matchesTimeRange = true

      if (filters.day) {
        matchesDay = row.dia === filters.day
      }

      if (filters.timeFrom || filters.timeTo) {
        const rowTimestamp = row.timestamp * 1000 // Convertir a milisegundos

        const fromTimestamp = filters.timeFrom ? parseHoraToTimestamp(filters.timeFrom) * 1000 : 0

        const toTimestamp = filters.timeTo
          ? parseHoraToTimestamp(filters.timeTo) * 1000
          : 86400000 - 1 // 23:59:59 en milisegundos

        matchesTimeRange = rowTimestamp >= fromTimestamp && rowTimestamp <= toTimestamp
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
          {/* Comparar vs la señal bruta */}
          <SimpleLineChart data={filteredData} yKey="corriente" />
        </div>
        <div className="grafic-three">
          {/* Gráfico con anotaciones de tablas */}
          <SimpleLineChart
            data={filteredData}
            yKey="corrienteFiltrada"
            tablas={tablas}
            annotate={true}
          />
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
            const horaASegundos = (hora) => {
              const [h, m, s] = hora.split(':').map(Number)
              return h * 3600 + m * 60 + s
            }
            const formatoDuracion = (segundos) => {
              const minutos = Math.floor(segundos / 60)
              const segs = segundos % 60
              return `${minutos}:${segs.toString().padStart(2, '0')}`
            }
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
                  TABLA #{t.tablaId} (hora inicio: {tablaHoraInicio} - hora fin: {tablaHoraFin} -
                  duración:{' '}
                  {formatoDuracion(horaASegundos(tablaHoraFin) - horaASegundos(tablaHoraInicio))})
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
                            CORTE #{c.corteId}
                            <br />
                            Inicio: {corteHoraInicio}
                            <br />
                            Fin: {corteHoraFin}
                            <br />
                            Duración:{' '}
                            {formatoDuracion(
                              horaASegundos(corteHoraFin) - horaASegundos(corteHoraInicio)
                            )}
                            <br />
                            Corriente máxima: {c.maxCorriente.toFixed(2)} A
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
