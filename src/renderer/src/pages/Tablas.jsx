import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleTable from '../components/Table'
import SimpleLineChart from '../components/LineChart'
import FileUploadPopup from '../components/FileUploadPopup'
import DateFilter from '../components/DateFilter'
import '../styles/Tablas.css'
import { applyLowPassFilter, detectCuts } from '../helpers'

const Tablas = () => {
  const navigate = useNavigate()
  const [rawData, setRawData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [cuts, setCuts] = useState([])
  const [selectedCutIndex, setSelectedCutIndex] = useState(null)

  const [filters, setFilters] = useState({
    day: '',
    timeFrom: '',
    timeTo: ''
  })

  const [smoothValue, setSmoothValue] = useState(5)

  const togglePopup = () => {
    setShowPopup((prev) => !prev)
  }
  const [showPopup, setShowPopup] = useState(false)

  // Cuando se termina de leer el archivo en FileUploadPopup
  const handleFileRead = (data) => {
    // 1. Guardar en rawData
    setRawData(data)

    // 2. Aplicar Lowpass
    //    Ejemplo: hardcode alpha = 0.05 (o cálculalo según smoothValue)
    const alpha = 0.05
    const lowpassed = applyLowPassFilter(data, alpha)
    setFilteredData(lowpassed)

    // 3. Detectar cortes
    const threshold = 0.5
    const baseline = 1.0
    const foundCuts = detectCuts(lowpassed, threshold, baseline)
    setCuts(foundCuts)
    setSelectedCutIndex(null)
  }

  // Ejemplo: si deseas recalcular el Lowpass con un "alpha" derivado de smoothValue
  const handleSmoothChange = (value) => {
    setSmoothValue(value)
    if (rawData.length > 0) {
      const alpha = value / 100 // p.ej. smoothValue=5 => alpha=0.05
      const lowpassed = applyLowPassFilter(rawData, alpha)
      setFilteredData(lowpassed)
      // Redetectar cortes
      const foundCuts = detectCuts(lowpassed, 0.5, 1.0)
      setCuts(foundCuts)
      setSelectedCutIndex(null)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Filtrado por dia y rango horario (sobre filteredData)
  const filteredTimeData = useMemo(() => {
    return filteredData.filter((row) => {
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
  }, [filteredData, filters])

  // Si el usuario NO ha seleccionado un corte, mostramos los datos filtrados completos.
  // Si sí seleccionó, mostramos SOLO los datos correspondientes a ese corte.
  const finalData = useMemo(() => {
    if (selectedCutIndex == null) {
      return filteredTimeData
    }
    // Buscar el corte en cuts
    const c = cuts[selectedCutIndex]
    if (!c) return filteredTimeData

    // Extraer el subset de datos entre startIndex y endIndex
    const slice = filteredTimeData.slice(c.startIndex, c.endIndex + 1)

    return slice
  }, [filteredTimeData, selectedCutIndex, cuts])

  // Para mostrar en la tabla de "cortes encontrados"
  // Se listan como "Tabla 1", "Tabla 2", etc.
  const handleSelectCut = (index) => {
    setSelectedCutIndex(index)
  }

  return (
    <div className="main-tablas">
      <div className="header-tablas">
        <h1>Panel de Datos</h1>
        <div className="header-buttons">
          <button className="primary-button" onClick={() => navigate('/')}>
            Volver
          </button>
          <button className="secondary-button" onClick={() => setShowPopup(true)}>
            Cargar datos
          </button>
        </div>
      </div>

      {showPopup && (
        <FileUploadPopup onClose={() => setShowPopup(false)} onFileRead={handleFileRead} />
      )}

      <DateFilter
        onFilterChange={handleFilterChange}
        smoothValue={smoothValue}
        onSmoothChange={handleSmoothChange}
      />

      {/* Info de cuántos cortes se detectaron */}
      <div style={{ margin: '1rem 0' }}>
        <strong>Cortes detectados:</strong> {cuts.length}
      </div>

      {/* Tabla de cortes (cortes detectados) */}
      {cuts.length > 0 && (
        <table style={{ marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th>Tabla</th>
              <th>Inicio (día/hora)</th>
              <th>Fin (día/hora)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuts.map((cut, index) => (
              <tr key={index}>
                <td>Tabla {index + 1}</td>
                <td>
                  {cut.dayStart} {cut.timeStart}
                </td>
                <td>
                  {cut.dayEnd} {cut.timeEnd}
                </td>
                <td>
                  <button onClick={() => handleSelectCut(index)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="parent-grid">
        <div className="down-left-grid">
          {/* Aquí mostramos la tabla con los datos finales (sea el corte seleccionado o todo) */}
          <SimpleTable data={finalData} />
        </div>

        {/* Graficos que representan finalData */}
        <div className="grafic-one">
          <SimpleLineChart data={finalData} />
        </div>
        <div className="grafic-two">
          <SimpleLineChart data={finalData} />
        </div>
        <div className="grafic-three">
          <SimpleLineChart data={finalData} />
        </div>
      </div>
    </div>
  )
}

export default Tablas
