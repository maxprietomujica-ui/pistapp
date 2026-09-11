// Todo lo numérico se calcula acá, en el cliente. La IA nunca hace matemáticas,
// solo interpreta los números que ya calculamos.

// Para atletismo, menos tiempo = mejor. Para gimnasio, más peso = mejor.
function esMejorAtletismo(nuevo, actual) {
  return nuevo < actual
}
function esMejorGimnasio(nuevo, actual) {
  return nuevo > actual
}

export function mejorMarca(marcas, deporte) {
  if (!marcas.length) return null
  const comparar = deporte === 'atletismo' ? esMejorAtletismo : esMejorGimnasio
  return marcas.reduce((mejor, m) => (comparar(m.valor, mejor.valor) ? m : mejor))
}

export function porcentajeMejora(marcas, deporte) {
  if (marcas.length < 2) return null
  const ordenadas = [...marcas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const primera = ordenadas[0].valor
  const ultima = ordenadas[ordenadas.length - 1].valor
  const diferencia = deporte === 'atletismo' ? primera - ultima : ultima - primera
  return Number(((diferencia / primera) * 100).toFixed(1))
}

export function promedioUltimas(marcas, n = 5) {
  if (!marcas.length) return null
  const ordenadas = [...marcas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  const ultimas = ordenadas.slice(0, n)
  const suma = ultimas.reduce((acc, m) => acc + m.valor, 0)
  return Number((suma / ultimas.length).toFixed(2))
}

export function rachaDias(entrenamientos) {
  if (!entrenamientos.length) return 0
  const fechas = [...new Set(entrenamientos.map((e) => e.fecha))].sort((a, b) => new Date(b) - new Date(a))
  let racha = 1
  for (let i = 0; i < fechas.length - 1; i++) {
    const dif = (new Date(fechas[i]) - new Date(fechas[i + 1])) / (1000 * 60 * 60 * 24)
    if (dif <= 3) racha++ // tolera hasta 2 días de descanso entre sesiones
    else break
  }
  return racha
}

export function serieParaGrafico(marcas) {
  return [...marcas]
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map((m) => ({ fecha: m.fecha, valor: m.valor }))
}

export function volumenGimnasio(entrenamiento) {
  // series x reps x peso, sumado sobre todos los ejercicios del entrenamiento
  return (entrenamiento.ejercicios || []).reduce((total, ej) => {
    return total + (ej.series || 0) * (ej.reps || 0) * (ej.peso || 0)
  }, 0)
}

export function metrosTotalesAtletismo(entrenamiento) {
  return (entrenamiento.ejercicios || []).reduce((total, ej) => {
    return total + (ej.distancia || 0) * (ej.repeticiones || 0)
  }, 0)
}
