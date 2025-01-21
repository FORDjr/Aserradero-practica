import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const SimpleLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos para graficar</p>
  }

  const chartData = {
    labels: data.map((item) => item.hora),
    datasets: [
      {
        label: 'Corriente',
        data: data.map((item) => item.corriente),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)',
        tension: 0.4, 
        pointRadius: 0 
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: false,
          text: 'Hora'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10
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
      }
    }
  }

  return (
    <div style={{ width: '100vw', height: '200px', margin: '0 auto' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default SimpleLineChart
