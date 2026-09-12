// Esta función corre en el servidor de Netlify, nunca en el navegador.
// Por eso la API key de Gemini está segura acá (variable de entorno GEMINI_API_KEY).

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const { deporte, disciplina, marcas, entrenamientosRecientes, estadisticas, pregunta } = JSON.parse(event.body)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Falta configurar GEMINI_API_KEY en Netlify' }) }
    }

    const criterio = deporte === 'atletismo'
      ? 'En este deporte, MENOS tiempo es mejor rendimiento.'
      : 'En este deporte, MÁS peso o repeticiones es mejor rendimiento.'

    const tieneMarcas = marcas && marcas.length > 0

    const prompt = `Eres un coach deportivo que analiza datos reales de un atleta. Nunca inventes números que no te dieron.

Deporte: ${deporte}
${disciplina ? `Disciplina/ejercicio: ${disciplina}` : 'Todavía no hay una disciplina específica con marcas registradas, solo entrenamientos.'}
${criterio}

${tieneMarcas ? `Estadísticas ya calculadas (no las recalcules, solo interprétalas):
${JSON.stringify(estadisticas, null, 2)}

Marcas recientes (fecha y valor):
${JSON.stringify(marcas, null, 2)}` : 'Todavía no hay marcas registradas, así que basa tu análisis solo en los entrenamientos.'}

Entrenamientos recientes:
${JSON.stringify(entrenamientosRecientes, null, 2)}

${pregunta ? `Pregunta del atleta: ${pregunta}` : tieneMarcas
  ? 'Dale un análisis breve de su progreso: tendencia, posibles puntos fuertes y una recomendación general de enfoque para las próximas semanas.'
  : 'Dale una lectura breve de sus entrenamientos recientes: consistencia, tipo de trabajo que ha hecho, y una recomendación general de enfoque para las próximas semanas.'}

Responde en español, en máximo 120 palabras, tono cercano y directo, sin inventar cifras que no se te dieron.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await response.json()
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar un análisis en este momento.'

    return { statusCode: 200, body: JSON.stringify({ analisis: texto }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
