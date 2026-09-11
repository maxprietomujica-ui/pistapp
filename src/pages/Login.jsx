import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [modo, setModo] = useState('entrar') // 'entrar' | 'crear'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    if (modo === 'crear') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setCargando(false); return }
      if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, nombre })
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setCargando(false); return }
    }
    setCargando(false)
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>PISTAPP</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>Registra tu entrenamiento. Sigue tu marca.</p>

      <form onSubmit={manejarSubmit}>
        {modo === 'crear' && (
          <div className="field-group">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
        )}
        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>

        {error && <p style={{ color: 'var(--track)', fontSize: 14 }}>{error}</p>}

        <button className="btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Un momento...' : modo === 'crear' ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>

      <button
        className="btn-secondary"
        style={{ marginTop: 12 }}
        onClick={() => setModo(modo === 'crear' ? 'entrar' : 'crear')}
      >
        {modo === 'crear' ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
      </button>
    </div>
  )
}
