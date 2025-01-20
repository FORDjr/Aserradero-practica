// SimpleTable.jsx
import { useState } from 'react';

const SimpleTable = ({ data }) => {
  console.log('[SimpleTable] data:', data);

  const totalData = data || [];
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(totalData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const currentData = totalData.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
  };

  if (totalData.length === 0) {
    return <p>No hay datos en la tabla.</p>;
  }

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Día</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Hora</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Corriente</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{row.dia}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{row.hora}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{row.corriente}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={handlePrev} disabled={currentPage === 0}>
            Anterior
          </button>
          <span style={{ margin: '0 10px' }}>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleTable;
