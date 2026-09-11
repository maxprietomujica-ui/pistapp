import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LogWorkout({ userId, onGuardado }) {
  const [deporte, setDeporte] = useState('atletismo')
  const [tipo, setTipo] = useState('')
  const [sensaciones, setSensaciones] = useState('')
  const [ejercicios, setEjercicios] = useState([{}])
  const [guardando, setGuardando] = useState(false)

  function actualizarEjercicio(i, campo, valor) {
    const copia = [...ejercicios]
    copia[i] = { ...copia[i], [campo]: Number(valor) || valor }
    setEjercicios(copia)
  }

  function agregarEjercicio() {
    setEjercicios([...ejercicios, {}])
  }

  function quitarEjercicio(i) {
    setEjercicios(ejercicios.filter((_, idx) => idx !== i))
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    await supabase.from('entrenamientos').insert({
      user_id: userId,
      deporte,
      tipo,
      ejercicios,
      sensaciones
    })
    setGuardando(false)
    setTipo(''); setSensaciones(''); setEjercicios([{}])
    onGuardado?.()
  }

  return (
    <div className="page">
      <h2>Nuevo entrenamiento</h2>

      <div style={{ marginBottom: 16 }}>
        <span className={`pill ${deporte === 'atletismo' ? 'active' : ''}`} onClick={() => setDeporte('atletismo')}>Atletismo</span>
        <span className={`pill ${deporte === 'gimnasio' ? 'active' : ''}`} onClick={() => setDeporte('gimnasio')}>Gimnasio</span>
      </div>

      <form onSubmit={guardar}>
        <div className="field-group">
          <label>Tipo de sesión</label>
          <input
            placeholder={deporte === 'atletismo' ? 'ej: velocidad, resistencia, técnica' : 'ej: tren superior, piernas'}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </div>

        <label style={{ fontSize: 13, color: 'var(--steel)' }}>Ejercicios</label>
        {ejercicios.map((ej, i) => (
          <div className="ejercicio-row" key={i}>
            {deporte === 'atletismo' ? (
              <>
                <input type="number" placeholder="Distancia (m)" onChange={(e) => actualizarEjercicio(i, 'distancia', e.target.value)} />
                <input type="number" placeholder="Repeticiones" onChange={(e) => actualizarEjercicio(i, 'repeticiones', e.target.value)} />
                <input type="number" placeholder="Series" onChange={(e) => actualizarEjercicio(i, 'series', e.target.value)} />
              </>
            ) : (
              <>
                <input placeholder="Ejercicio" onChange={(e) => actualizarEjercicio(i, 'nombre', e.target.value)} />
                <input type="number" placeholder="Series" onChange={(e) => actualizarEjercicio(i, 'series', e.target.value)} />
                <input type="number" placeholder="Reps x Peso" onChange={(e) => actualizarEjercicio(i, 'reps', e.target.value)} />
              </>
            )}
            <button type="button" onClick={() => quitarEjercicio(i)} style={{ background: 'none', border: 'none', color: 'var(--steel)' }}>✕</button>
          </div>
        ))}
        <button type="button" className="btn-secondary" style={{
