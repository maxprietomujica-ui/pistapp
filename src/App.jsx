import { useEffect, useState, useCallback } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Home from './pages/Home'
import LogWorkout from './pages/LogWorkout'
import Marks from './pages/Marks'
import ProgressPage from './pages/Progress'
import Coach from './pages/Coach'

export default function App() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('home')
  const [nombre, setNombre] = useState('')
  const [entrenamientos, setEntrenamientos] = useState([])
  const [marcas, setMarcas] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  const cargarDatos = useCallback(async () => {
    if (!session) return
    const userId = session.user.id

    const { data: perfil } = await supabase.from('profiles').select('nombre').eq('id', userId).single()
    if (perfil) setNombre(perfil.nombre)

    const { data: ent } = await supabase.from('entrenamientos').select('*').eq('user_id', userId).order('fecha', { ascending: false })
    if (ent) setEntrenamientos(ent)

    const { data: mrc } = await supabase.from('marcas').select('*').eq('user_id', userId).order('fecha', { ascending: false })
    if (mrc) setMarcas(mrc)
  }, [session])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  if (!session) return <Login />

  const userId = session.user.id

  return (
    <div className="app-shell">
      {tab === 'home' && <Home nombre={nombre} entrenamientos={entrenamientos} marcas={marcas} />}
      {tab === 'entrenar' && <LogWorkout userId={userId} onGuardado={cargarDatos} />}
      {tab === 'marcas' && <Marks userId={userId} marcas={marcas} onGuardado={cargarDatos} />}
      {tab === 'progreso' && <ProgressPage marcas={marcas} entrenamientos={entrenamientos} />}
      {tab === 'coach' && <Coach marcas={marcas} entrenamientos={entrenamientos} />}

      <nav className="bottom-nav">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>🏠<span>Inicio</span></button>
        <button className={tab === 'entrenar' ? 'active' : ''} onClick={() => setTab('entrenar')}>📝<span>Entrenar</span></button>
        <button className={tab === 'marcas' ? 'active' : ''} onClick={() => setTab('marcas')}>🏅<span>Marcas</span></button>
        <button className={tab === 'progreso' ? 'active' : ''} onClick={() => setTab('progreso')}>📈<span>Progreso</span></button>
        <button className={tab === 'coach' ? 'active' : ''} onClick={() => setTab('coach')}>🤖<span>Coach</span></button>
      </nav>

      <button
        onClick={() => supabase.auth.signOut()}
        style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--steel)', fontSize: 12 }}
      >
        Salir
      </button>
    </div>
  )
}
