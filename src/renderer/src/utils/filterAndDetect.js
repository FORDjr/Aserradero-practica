// filterAndDetect.jsx

/**
 * Filtro Lowpass simple con factor alpha.
 *   filtered[0] = raw[0]
 *   filtered[i] = alpha * raw[i] + (1 - alpha) * filtered[i - 1]
 */
export function lowPassFilter(data, alpha = 0.05) {
  if (!data || data.length === 0) return []

  let filteredPrev = data[0].corriente
  const result = data.map((row, i) => {
    if (i === 0) {
      return { ...row, corrienteFiltrada: filteredPrev }
    } else {
      const currentRaw = row.corriente
      const filteredVal = alpha * currentRaw + (1 - alpha) * filteredPrev
      filteredPrev = filteredVal
      return { ...row, corrienteFiltrada: filteredVal }
    }
  })
  return result
}

/**
 * Paso 1: Detección de TABLAS (ON) vs OFF, usando el método del mayor salto para definir el umbral.
 *         Añadimos un "duracionMinimaTabla" para evitar tablas muy cortas.
 */
function detectTablasDinamico(data) {
  if (!data || data.length === 0) return { tablas: [], THRESH_OFF: null }

  // 1) Obtener todas las corrientes filtradas
  const corrientes = data.map((d) => d.corrienteFiltrada)

  // 2) Ordenar las corrientes de menor a mayor
  const sorted = [...corrientes].sort((a, b) => a - b)

  // 3) Calcular las diferencias entre valores consecutivos
  const diferencias = sorted.slice(1).map((val, idx) => val - sorted[idx])

  // 4) Encontrar el índice del mayor salto
  let maxDif = -Infinity
  let maxIndex = -1
  diferencias.forEach((diff, idx) => {
    if (diff > maxDif) {
      maxDif = diff
      maxIndex = idx
    }
  })

  // 5) Definir el umbral como el punto medio del mayor salto
  const THRESH_OFF = (sorted[maxIndex] + sorted[maxIndex + 1]) / 2

  // 6) Detectar tablas basadas en el umbral dinámico
  const duracionMinimaTabla = 5 // en muestras (asumiendo 1 muestra/segundo => 5 seg)
  let tablas = []
  let inTable = false
  let startIndex = 0

  for (let i = 0; i < data.length; i++) {
    const c = data[i].corrienteFiltrada

    // Iniciar tabla cuando la corriente supera el umbral OFF
    if (!inTable && c >= THRESH_OFF) {
      inTable = true
      startIndex = i
    }

    // Finalizar tabla cuando la corriente baja del umbral OFF
    if (inTable && c < THRESH_OFF) {
      const length = i - startIndex
      if (length >= duracionMinimaTabla) {
        tablas.push({ startIndex, endIndex: i - 1 })
      }
      inTable = false
    }
  }

  // Manejar caso donde la última muestra sigue en tabla
  if (inTable) {
    const length = data.length - startIndex
    if (length >= duracionMinimaTabla) {
      tablas.push({ startIndex, endIndex: data.length - 1 })
    }
  }

  return { tablas, THRESH_OFF }
}

/**
 * Paso 2: Dentro de UNA tabla, calculamos su baseline (mediana) y desviación estándar (corrienteFiltrada).
 *         Definimos umbralCorte = baseline + k * stdDev.
 *         Añadimos "duracionMinimaCorte" para descartar cortes muy cortos.
 *
 * @param dataTabla subset de filas que pertenecen a la tabla
 * @param offset    índice base dentro de data global
 */
function detectCortesDentroDeTabla(dataTabla, offset = 0) {
  if (!dataTabla || dataTabla.length === 0) return []

  // 1) Calcular todas las corrientes filtradas dentro de la tabla
  const valores = dataTabla.map((d) => d.corrienteFiltrada)
  const n = valores.length

  // 2) Calcular la mediana para el baseline
  const sorted = [...valores].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  // 3) Calcular la desviación estándar
  const variance = valores.reduce((sum, val) => sum + Math.pow(val - median, 2), 0) / n
  const stdDev = Math.sqrt(variance)

  // 4) Definir umbrales para cortes
  const umbralCorte = median + 1.0 * stdDev // Ajusta este valor según tus necesidades

  // 5) Parámetros para detección de cortes
  const duracionMinimaCorte = 3 // en muestras
  const tiempoMinEntreCortes = 5 // Mínimo tiempo entre cortes
  let cortes = []

  let inCorte = false
  let corteStart = 0
  let samplesAboveThreshold = 0
  let ultimoCorteEnd = -tiempoMinEntreCortes // Para controlar tiempo entre cortes

  for (let i = 0; i < n; i++) {
    const currentVal = valores[i]

    if (currentVal >= umbralCorte) {
      samplesAboveThreshold += 1
      if (!inCorte && samplesAboveThreshold >= duracionMinimaCorte) {
        inCorte = true
        corteStart = i - duracionMinimaCorte + 1
      }
    } else {
      if (inCorte) {
        const corteEnd = i - 1
        const corteMax = Math.max(...valores.slice(corteStart, corteEnd + 1))
        cortes.push({
          startIndex: offset + corteStart,
          endIndex: offset + corteEnd,
          maxCorriente: corteMax
        })
        ultimoCorteEnd = i
      }
      inCorte = false
      samplesAboveThreshold = 0
    }
  }

  // Manejar corte activo al final de los datos
  if (inCorte) {
    const corteEnd = n - 1
    const corteMax = Math.max(...valores.slice(corteStart, corteEnd + 1))
    cortes.push({
      startIndex: offset + corteStart,
      endIndex: offset + corteEnd,
      maxCorriente: corteMax
    })
  }

  return cortes
}

/**
 * Función principal para detectar tablas y cortes con umbrales dinámicos.
 *
 * @param data Datos filtrados
 */
export function detectTablasYcortes(data) {
  if (!data || data.length === 0) {
    return { annotatedData: [], tablas: [] }
  }

  // 1) Detectar tablas con umbral dinámico basado en el mayor salto
  const { tablas: tablasDetectadas, THRESH_OFF } = detectTablasDinamico(data)

  // 2) Para cada tabla, detectar cortes internos
  const tablas = []
  tablasDetectadas.forEach((tbl, idx) => {
    const { startIndex, endIndex } = tbl
    const subData = data.slice(startIndex, endIndex + 1)

    const cortes = detectCortesDentroDeTabla(subData, startIndex).map((c, iCorte) => ({
      ...c,
      corteId: iCorte + 1
    }))

    tablas.push({
      tablaId: idx + 1,
      startIndex,
      endIndex,
      cortes
    })
  })

  // 3) Generar annotatedData = clonamos data y añadimos 'state'
  const annotatedData = data.map((row) => ({ ...row, state: 'OFF' }))

  // Para cada tabla => marcar 'ON'
  // Para cada corte => marcar 'CUTTING'
  tablas.forEach((t) => {
    // Tabla ON
    for (let i = t.startIndex; i <= t.endIndex; i++) {
      annotatedData[i].state = 'ON'
    }
    // Sus cortes en CUTTING
    t.cortes.forEach((c) => {
      for (let j = c.startIndex; j <= c.endIndex; j++) {
        annotatedData[j].state = 'CUTTING'
      }
    })
  })

  return { annotatedData, tablas, THRESH_OFF }
}
