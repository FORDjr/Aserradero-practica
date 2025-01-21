import { useState } from 'react'
import '../styles/Table.css'

const SimpleTable = ({ data }) => {
  const totalData = data || []
  const pageSize = 20
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(totalData.length / pageSize)
  const startIndex = currentPage * pageSize
  const currentData = totalData.slice(startIndex, startIndex + pageSize)

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
  }
  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1)
  }

  if (totalData.length === 0) {
    return <p className="no-data-text">No hay datos en la tabla.</p>
  }

  return (
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Hora</th>
            <th>Corriente</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.dia}</td>
              <td>{row.hora}</td>
              <td>{row.corriente}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button className="pagination-button" onClick={handlePrev} disabled={currentPage === 0}>
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default SimpleTable
