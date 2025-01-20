// SimpleLineChart.jsx
import React from 'react'
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
        tension: 0, // línea sin curvatura
        pointRadius: 0 // sin marcadores
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // clave para que el alto no dependa del ancho
    scales: {
      x: {
        // Título del eje X (opcional desactivarlo, si ya lo desactivaste no es necesario)
        title: {
            display: false,
            text: 'Hora'
          },
        ticks: {
            autoSkip: true,       // Salta automáticamente algunas etiquetas
            maxTicksLimit: 10      // Máximo de ticks visibles (ajusta el número a tu gusto)
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
