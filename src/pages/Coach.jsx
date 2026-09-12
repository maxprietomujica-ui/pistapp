import { useState } from 'react'
import { mejorMarca, porcentajeMejora, promedioUltimas, serieParaGrafico } from '../lib/stats'

export default function Coach({ marcas, entrenamientos }) {
  const disciplinas = [...new Set(marcas.map((m) => m.disciplina))]
  const [seleccion, setSeleccion] = useState(disciplinas[0] || '')
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)

  const hayMarcas = disciplinas.length > 0
  const hayEntrenamientos = entrenamientos.length > 0

  async function preguntar(preguntaFija) {
    setCargando(true)
    setRespuesta('')

    let body

    if (hayMarcas && seleccion) {
      const propias = marcas.filter((m) => m.disciplina === seleccion)
      const deporte = propias[0].deporte
      const estadisticas = {
        mejorMarca: mejorMarca(propias, deporte)?.valor,
        mejoraTotal: porcentajeMejora(propias, deporte),
        promedioUltimas5: promedioUltimas(propias)
      }
      body = {
        deporte,
        disciplina: seleccion,
        marcas: serieParaGrafico(propias),
        entrenamientosRecientes: entrenamientos.slice(0, 5),
        estadisticas,
        pregunta: preguntaFija || pregunta
      }
    } else {
      body = {
        deporte: entrenamientos[0]?.deporte || 'atletismo',
        disciplina: null,
        marcas: [],
        entrenamientosRecientes: entrenamientos.slice(0, 8),
        estadisticas: {},
        pregunta: preguntaFija || pregunta
      }
    }

    const res = await fetch('/.netlify/functions/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    setRespuesta(data.analisis || data.error || 'No se pudo generar el análisis.')
    setCargando(false)
  }

  return (
    <div className="page">
      <h2>Coach IA</h2>

      {!hayMarcas && !hayEntrenamientos && (
        <p style={{ color: 'var(--steel)' }}>Registra al menos un entrenamiento o una marca para poder analizar tu progreso.</p>
      )}

      {hayMarcas && (
        <div style={{ marginBottom: 16 }}>
          {disciplinas.map((d) => (
            <span key={d} className={`pill ${seleccion === d ? 'active' : ''}`} onClick={() => setSeleccion(d)}>{d}</span>
          ))}
        </div>
      )}

      {!hayMarcas && hayEntrenamientos && (
        <p style={{ color: 'var(--steel)', fontSize: 14, marginBottom: 16 }}>
          Todavía no tienes marcas registradas, pero puedo analizar tus últimos entrenamientos.
        </p>
      )}

      {(hayMarcas || hayEntrenamientos) && (
        <>
          <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => preguntar()} disabled={cargando}>
            {cargando ? 'Analizando...' : 'Analizar mi progreso'}
          </button>

          <div className="field-group">
            <label>O pregúntale algo específico</label>
            <textarea rows={2} value={pregunta} onChange={(e) => setPregunta(e.target.value)} placeholder="¿Por qué esta semana rendí más lento?" />
          </div>
          <button className="btn-secondary" onClick={() => preguntar(pregunta)} disabled={cargando || !pregunta}>
            Preguntar
          </button>

          {respuesta && (
            <div className="card" style={{ marginTop: 16 }}>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{respuesta}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
