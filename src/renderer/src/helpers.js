// helpers.js (puedes moverlo a un archivo aparte si gustas)
// Calcula la media de un array de números
export const average = (arr) => {
  if (!arr.length) return 0
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}

// Aplica un filtro Lowpass exponencial
// filtered[0] = raw[0]
// filtered[i] = alpha * raw[i] + (1 - alpha) * filtered[i-1]
// helpers.js

export const applyLowPassFilter = (data, alpha = 0.01) => {
  if (!data || data.length === 0) return []

  const filteredVals = []
  filteredVals[0] = data[0].corriente // primer valor = bruta

  for (let i = 1; i < data.length; i++) {
    const raw = data[i].corriente
    filteredVals[i] = alpha * raw + (1 - alpha) * filteredVals[i - 1]
  }

  return data.map((item, i) => ({
    ...item,
    corrienteFiltrada: filteredVals[i]
  }))
}

// Detecta "flancos" (cortes) según la lógica:
// 1. Se calcula la diferencia entre el promedio de [i-5..i] y [i+1..i+5] (ajusta si quieres)
// 2. Si la diferencia absoluta es > threshold => flanco
// 3. Chequeamos corriente filtrada > baseline para determinar si es un "corte real".
// 4. Guardamos el momento de subida (start) y bajada (end) para armar los segmentos
export const detectCuts = (
  data,
  threshold = 0.5, // umbral de diferencia
  baseline = 1.0 // corriente mínima para considerar "corte"
) => {
  let cuts = []
  let inCut = false
  let startIndex = null

  // Necesitamos suficiente data a los costados (i-5, i+5).
  // Ajusta para no pasarte de los límites.
  for (let i = 5; i < data.length - 5; i++) {
    const pastSlice = data.slice(i - 5, i) // 5 datos pasados
    const futureSlice = data.slice(i + 1, i + 6) // 5 datos futuros

    const pastAvg = average(pastSlice.map((d) => d.corrienteFiltrada))
    const futureAvg = average(futureSlice.map((d) => d.corrienteFiltrada))

    const diff = pastAvg - futureAvg

    // Verificamos si cruza el umbral:
    if (Math.abs(diff) > threshold) {
      // Flanco de subida => posible inicio de corte
      if (diff > 0 && !inCut && data[i].corrienteFiltrada > baseline) {
        inCut = true
        startIndex = i
      }
      // Flanco de bajada => posible fin de corte
      else if (diff < 0 && inCut) {
        inCut = false
        if (startIndex !== null) {
          // Registramos un corte con su inicio y fin
          cuts.push({
            startIndex,
            endIndex: i,
            // Información de tiempo (aprox) en el punto de inicio y fin
            dayStart: data[startIndex].dia,
            timeStart: data[startIndex].hora,
            dayEnd: data[i].dia,
            timeEnd: data[i].hora
          })
        }
        startIndex = null
      }
    }
  }

  return cuts
}
