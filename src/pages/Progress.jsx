import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { serieParaGrafico, porcentajeMejora, promedioUltimas, rachaDias } from '../lib/stats'

export default function ProgressPage({ marcas, entrenamientos }) {
  const disciplinas = [...new Set(marcas.map((m) => m.disciplina))]
  const [seleccion, setSeleccion] = useState(disciplinas[0] || '')

  const propias = marcas.filter((m) => m.disciplina === seleccion)
  const deporte = propias[0]?.deporte
  const serie = serieParaGrafico(propias)
  const mejora = porcentajeMejora(propias, deporte)
  const promedio = promedioUltimas(propias)
  const racha = rachaDias(entrenamientos)

  return (
    <div className="page">
      <h2>Progreso</h2>

      {disciplinas.length === 0 ? (
        <p style={{ color: 'var(--steel)' }}>Todavía no tienes marcas registradas.</p>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            {disciplinas.map((d) => (
              <span key={d} className={`pill ${seleccion === d ? 'active' : ''}`} onClick={() => setSeleccion(d)}>{d}</span>
            ))}
          </div>

          <div className="card">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={serie}>
                <XAxis dataKey="fecha" stroke="var(--steel)" fontSize={11} />
                <YAxis stroke="var(--steel)" fontSize={11} domain={['auto', 'auto']} reversed={deporte === 'atletismo'} />
                <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--iron)' }} />
                <Line type="monotone" dataKey="valor" stroke="var(--track)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="stat-row"><span>Mejora total</span><span className="stat-value">{mejora}%</span></div>
            <div className="stat-row"><span>Promedio últimas 5</span><span className="stat-value">{promedio}</span></div>
            <div className="stat-row"><span>Racha de entrenamientos</span><span className="stat-value">{racha}</span></div>
          </div>
        </>
      )}
    </div>
  )
}
