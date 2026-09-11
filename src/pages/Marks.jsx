import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mejorMarca } from '../lib/stats'

export default function Marks({ userId, marcas, onGuardado }) {
  const [deporte, setDeporte] = useState('atletismo')
  const [disciplina, setDisciplina] = useState('')
  const [valor, setValor] = useState('')
  const [reps, setReps] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    await supabase.from('marcas').insert({
      user_id: userId,
      deporte,
      disciplina,
      valor: Number(valor),
      unidad: deporte === 'atletismo' ? 'segundos' : 'kg',
      reps: deporte === 'gimnasio' ? Number(reps) : null,
      contexto: 'entrenamiento'
    })
    setGuardando(false)
    setDisciplina(''); setValor(''); setReps('')
    onGuardado?.()
  }

  const disciplinas = [...new Set(marcas.map((m) => m.disciplina))]

  return (
    <div className="page">
      <h2>Marcas</h2>

      <div className="card">
        <div style={{ marginBottom: 12 }}>
          <span className={`pill ${deporte === 'atletismo' ? 'active' : ''}`} onClick={() => setDeporte('atletismo')}>Atletismo</span>
          <span className={`pill ${deporte === 'gimnasio' ? 'active' : ''}`} onClick={() => setDeporte('gimnasio')}>Gimnasio</span>
        </div>
        <form onSubmit={guardar}>
          <div className="field-group">
            <label>{deporte === 'atletismo' ? 'Distancia (ej: 100m)' : 'Ejercicio (ej: sentadilla)'}</label>
            <input value={disciplina} onChange={(e) => setDisciplina(e.target.value)} required />
          </div>
          <div className="field-group">
            <label>{deporte === 'atletismo' ? 'Tiempo (segundos)' : 'Peso (kg)'}</label>
            <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </div>
          {deporte === 'gimnasio' && (
            <div className="field-group">
              <label>Repeticiones a ese peso</label>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
            </div>
          )}
          <button className="btn-primary" type="submit" disabled={guardando}>Guardar marca</button>
        </form>
      </div>

      {disciplinas.map((d) => {
        const propias = marcas.filter((m) => m.disciplina === d)
        const mejor = mejorMarca(propias, propias[0]?.deporte)
        return (
          <div className="card" key={d}>
            <h3 style={{ fontSize: 18 }}>{d}</h3>
            <div className="stat-row">
              <span>Mejor marca</span>
              <span className="stat-value">{mejor?.valor} {mejor?.unidad === 'segundos' ? 's' : 'kg'}</span>
            </div>
            {propias.slice(0, 5).map((m) => (
              <div className="stat-row" key={m.id} style={{ fontSize: 13, color: 'var(--steel)' }}>
                <span>{m.fecha}</span>
                <span>{m.valor} {m.unidad === 'segundos' ? 's' : 'kg'}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
