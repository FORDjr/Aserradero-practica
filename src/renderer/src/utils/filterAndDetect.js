// utils/filterAndDetect.js

/**
 * Filtro Lowpass simple con factor alpha.
 *   filtered[0] = raw[0]
 *   filtered[i] = alpha*raw[i] + (1-alpha)*filtered[i-1]
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
 * Paso 1: Detección de TABLAS (ON) vs OFF, usando un umbral global muy bajo (THRESH_OFF).
 *         Añadimos un "duracionMinimaTabla" para evitar tablas muy cortas.
 */
function detectTablas(data) {
  const THRESH_OFF = 1 // Se considera OFF por debajo de 1 A
  const duracionMinimaTabla = 5 // en muestras (asumiendo 1 muestra/segundo => 5 seg)

  let tablas = []
  let inTable = false
  let startIndex = 0

  for (let i = 0; i < data.length; i++) {
    const c = data[i].corrienteFiltrada

    // Si no estamos en tabla y la corriente >= THRESH_OFF => inicia tabla
    if (!inTable && c >= THRESH_OFF) {
      inTable = true
      startIndex = i
    }
    // Si estamos en tabla y la corriente baja de THRESH_OFF => fin de tabla
    if (inTable && c < THRESH_OFF) {
      const length = i - startIndex // cuántas muestras duró la tabla
      if (length >= duracionMinimaTabla) {
        tablas.push({ startIndex, endIndex: i - 1 })
      }
      inTable = false
    }
  }

  // Si al final seguimos en ON, cerramos la última tabla
  if (inTable) {
    const length = data.length - startIndex
    if (length >= duracionMinimaTabla) {
      tablas.push({ startIndex, endIndex: data.length - 1 })
    }
  }

  return tablas
}

/**
 * Paso 2: Dentro de UNA tabla, calculamos su media y desviación estándar (corrienteFiltrada).
 *         Definimos umbralCorte = media + k * stdDev.
 *         Añadimos "duracionMinimaCorte" para descartar cortes muy cortos.
 *
 * @param dataTabla subset de filas que pertenecen a la tabla
 * @param offset    índice base dentro de data global
 */
function detectCortesDentroDeTabla(dataTabla, offset = 0) {
  if (!dataTabla || dataTabla.length === 0) return []

  // 1) Calcular media y desviación estándar local
  const valores = dataTabla.map((d) => d.corrienteFiltrada)
  const n = valores.length
  const mean = valores.reduce((a, b) => a + b, 0) / n
  const variance = valores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)

  // Ajusta k para tu señal. Cuanto mayor sea, menos sensible a picos.
  const k = 0.6
  const umbralCorte = mean + k * stdDev

  // 2) Detectar intervalos "CUTTING" = (corriente >= umbralCorte)
  //    con duración mínima.
  const duracionMinimaCorte = 3 // en muestras (3 seg, si 1 muestra = 1 seg)
  let cortes = []

  let inCut = false
  let cutStart = 0

  for (let i = 0; i < n; i++) {
    const c = dataTabla[i].corrienteFiltrada
    // Inicia corte
    if (!inCut && c >= umbralCorte) {
      inCut = true
      cutStart = i
    }
    // Finaliza corte
    if (inCut && c < umbralCorte) {
      const length = i - cutStart
      if (length >= duracionMinimaCorte) {
        // Corte lo suficientemente largo
        cortes.push({
          startIndex: offset + cutStart,
          endIndex: offset + (i - 1)
        })
      }
      inCut = false
    }
  }

  // Si quedó un corte abierto al final
  if (inCut) {
    const length = n - cutStart
    if (length >= duracionMinimaCorte) {
      cortes.push({
        startIndex: offset + cutStart,
        endIndex: offset + (n - 1)
      })
    }
  }

  return cortes
}


export function detectTablasYcortes(data) {
  if (!data || data.length === 0) {
    return { annotatedData: [], tablas: [] }
  }

  // 1) Detectar tablas
  const tablasDetectadas = detectTablas(data)

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

  return { annotatedData, tablas }
}
