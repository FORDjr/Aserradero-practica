import '../styles/DateFilter.css'
const DateFilter = ({ onFilterChange }) => {
  return (
    <div className="filter-container">
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
          onChange={(e) => onFilterChange('timeFrom', e.target.value)}
          className="filter-input"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="timeToFilter">Hasta: </label>
        <input
          type="time"
          id="timeToFilter"
          onChange={(e) => onFilterChange('timeTo', e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  )
}

export default DateFilter
