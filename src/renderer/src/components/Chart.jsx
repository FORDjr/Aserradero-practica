import { LineChart } from '@mui/x-charts/LineChart'

export default function ChartGrafic({ data, type }) {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles para mostrar en el gráfico.</p>
  }

  if (!type) {
    return <p>Selecciona un tipo para visualizar los datos.</p>
  }

  const xAxisData = data.map((item) => item.hora);
  const seriesData = data.map((item) => parseFloat(item.corriente) || 0);
  

  return (
    <LineChart
      xAxis={[
        {
          data: xAxisData,
          scaleType: 'point',
          label: 'Hora',
          tickLabelStyle: {
            fontSize: 12
          }
        }
      ]}
      series={[
        {
          data: seriesData,
          label: 'Corriente',
          showMark: true,
          color: '#2196f3',
          curve: 'natural',
          lineWidth: 2,
          valueFormatter: (value) => `${value} A`
        }
      ]}
      sx={{
        '.MuiLineElement-root': {
          strokeWidth: 1
        },
        '.MuiMarkElement-root': {
          stroke: 'yellow',
          scale: '0',
          fill: 'red'
        }
      }}
      title="Medición de Corriente"
      grid={true}
      disableAxisListener={true}
      width={undefined}
      height={350}
    />
  )
}
