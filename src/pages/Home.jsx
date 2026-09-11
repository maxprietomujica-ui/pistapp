import { rachaDias } from '../lib/stats'

export default function Home({ nombre, entrenamientos, marcas }) {
  const ultimoEntrenamiento = entrenamientos[0]
  const racha = rachaDias(entrenamientos)

  return (
    <div className="page">
      <h1>Hola, {nombre || 'atleta'}</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 20 }}>Este es tu resumen</p>

      <div className="card">
        <div className="stat-row">
          <span>Racha de entrenamientos</span>
          <span className="stat-value">{racha}</span>
        </div>
        <div className="stat-row">
          <span>Entrenamientos totales</span>
          <span className="stat-value">{entrenamientos.length}</span>
        </div>
        <div className="stat-row">
          <span>Marcas registradas</span>
          <span className="stat-value">{marcas.length}</span>
        </div>
      </div>

      {ultimoEntrenamiento && (
        <div className="card">
          <h3 style={{ fontSize: 16 }}>Último entrenamiento</h3>
          <p style={{ color: 'var(--steel)', fontSize: 14, margin: '4px 0' }}>
            {ultimoEntrenamiento.fecha} · {ultimoEntrenamiento.deporte} {ultimoEntrenamiento.tipo ? `· ${ultimoEntrenamiento.tipo}` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
