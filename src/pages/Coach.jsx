import { useState } from 'react'
import { mejorMarca, porcentajeMejora, promedioUltimas, serieParaGrafico } from '../lib/stats'

export default function Coach({ marcas, entrenamientos }) {
  const disciplinas = [...new Set(marcas.map((m) => m.disciplina))]
  const [seleccion, setSeleccion] = useState(disciplinas[0] || '')
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)

  async function preguntar(preguntaFija) {
    const propias = marcas.filter((m) => m.disciplina === seleccion)
    if (!propias.length) return
    const deporte = propias[0].deporte

    setCargando(true)
    setRespuesta('')

    const estadisticas = {
      mejorMarca: mejorMarca(propias, deporte)?.valor,
      mejoraTotal: porcentajeMejora(propias, deporte),
      promedioUltimas5: promedioUltimas(propias)
    }

    const res = await fetch('/.netlify/functions/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deporte,
        disciplina: seleccion,
        marcas: serieParaGrafico(propias),
        entrenamientosRecientes: entrenamientos.slice(0, 5),
        estadisticas,
        pregunta: preguntaFija || pregunta
      })
    })
    const data = await res.json()
    setRespuesta(data.analisis || data.error || 'No se pudo generar el análisis.')
    setCargando(false)
  }

  return (
    <div className="page">
      <h2>Coach IA</h2>

      {disciplinas.length === 0 ? (
        <p style={{ color: 'var(--steel)' }}>Registra al menos una marca para poder analizar tu progreso.</p>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            {disciplinas.map((d) => (
              <span key={d} className={`pill ${seleccion === d ? 'active' : ''}`} onClick={() => setSeleccion(d)}>{d}</span>
            ))}
          </div>

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
