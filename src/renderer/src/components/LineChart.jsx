// LineChart.jsx
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  annotationPlugin,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const SimpleLineChart = ({ data, yKey = 'corriente', tablas = [], annotate = false }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos para graficar</p>
  }

  // Configuración para anotaciones solo si annotate es true
  let annotations = {}
  let chartData = {}
  let chartOptions = {}

  if (annotate && tablas.length > 0) {
    // Calcular los valores mínimos y máximos de Y para las anotaciones
    const yValues = data.map((item) => item[yKey])
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)

    // Crear las anotaciones
    tablas.forEach((t, i) => {
      const inicioTimestamp = data[t.startIndex]?.timestamp * 1000 // Convertir a milisegundos
      const finTimestamp = data[t.endIndex]?.timestamp * 1000 // Convertir a milisegundos

      if (inicioTimestamp) {
        annotations[`startLine${i}`] = {
          type: 'line',
          xMin: inicioTimestamp,
          xMax: inicioTimestamp,
          borderColor: 'red',
          borderWidth: 3,
        }
      }

      if (finTimestamp) {
        annotations[`endLine${i}`] = {
          type: 'line',
          xMin: finTimestamp,
          xMax: finTimestamp,
          borderColor: 'green',
          borderWidth: 3,
        }
      }
    })

    chartData = {
      labels: data.map((item) => new Date(item.timestamp * 1000)), // Convertir a objetos Date
      datasets: [
        {
          label: yKey,
          data: data.map((item) => ({ x: new Date(item.timestamp * 1000), y: item[yKey] })),
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.2)',
          tension: 0.4,
          pointRadius: 0
        }
      ]
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute', // Ajusta según la granularidad de tus datos
            displayFormats: {
              second: 'HH:mm:ss',
              minute: 'HH:mm:ss'
            }
          },
          title: {
            display: true,
            text: 'Hora'
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20
          }
        },
        y: {
          title: {
            display: true,
            text: 'Corriente (A)'
          },
          beginAtZero: false,
          min: yMin - (yMax - yMin) * 0.05, // Añadir margen
          max: yMax + (yMax - yMin) * 0.05
        }
      },
      plugins: {
        title: {
          display: false,
          text: 'Gráfico de Corriente'
        },
        legend: {
          display: true,
          position: 'top'
        },
        annotation: {
          annotations
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  } else {
    // Configuración predeterminada sin anotaciones
    chartData = {
      labels: data.map((item) => item.hora),
      datasets: [
        {
          label: yKey,
          data: data.map((item) => item[yKey]),
          borderColor: 'blue',
          backgroundColor: 'rgba(30, 255, 0, 0.2)',
          tension: 0.4,
          pointRadius: 0
        }
      ]
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hora'
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20
          }
        },
        y: {
          title: {
            display: true,
            text: 'Corriente (A)'
          }
        }
      },
      plugins: {
        title: {
          display: false,
          text: 'Gráfico de Corriente'
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '200px', margin: '0 auto' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default SimpleLineChart
