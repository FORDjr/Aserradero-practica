import { LineChart } from '@mui/x-charts/LineChart'

export default function ChartGrafic({ data, type }) {
  console.log('Datos para el gráfico:', data)
  console.log('Tipo seleccionado:', type)

  if (!data || data.length === 0) {
    return <p>No hay datos disponibles para mostrar en el gráfico.</p>
  }

  if (!type) {
    return <p>Selecciona un tipo para visualizar los datos.</p>
  }

  const xAxisData = data.map((item) => item.hora)
  const seriesData = data.map((item) => parseFloat(item.corriente) || 0)

  console.log('Datos del eje X:', xAxisData)
  console.log('Datos del eje Y:', seriesData)

  return (
    <LineChart
      xAxis={[{ 
        data: xAxisData,
        scaleType: 'point',
        label: 'Hora'
      }]}
      series={[
        {
          data: seriesData,
          label: 'Corriente',
          curve: 'linear',
          showMark: true
        }
      ]}
      width={1000}
      height={250}
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
    />
  )
}