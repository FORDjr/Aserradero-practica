import '../styles/DateFilter.css'
const DateFilter = ({ onFilterChange, smoothValue, onSmoothChange }) => {
  return (
    <div className="filter-container">
      {/* Filtros existentes */}
      <div className="filter-item">
        <label htmlFor="dayFilter">Día: </label>
        <input
          type="date"
          id="dayFilter"
          onChange={(e) => onFilterChange('day', e.target.value)}
          className="filter-input"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="timeFromFilter">Desde: </label>
        <input
          type="time"
          id="timeFromFilter"
          step="1"
          onChange={(e) => onFilterChange('timeFrom', e.target.value)}
          className="filter-input"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="timeToFilter">Hasta: </label>
        <input
          type="time"
          id="timeToFilter"
          step="1"
          onChange={(e) => onFilterChange('timeTo', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-item smooth-control">
        <label htmlFor="smoothFilter">Suavizado: {smoothValue}</label>
        <input
          type="range"
          id="smoothFilter"
          min="0"
          max="30"
          value={smoothValue}
          onChange={(e) => onSmoothChange(Number(e.target.value))}
          className="smooth-slider"
        />
      </div>
    </div>
  )
}

export default DateFilter
