import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import usuarioRoutes from './routes/usuario.routes'
import prontuarioRoutes from './routes/prontuario.routes'
import agendaRoutes from './routes/agenda.routes'
import filaRoutes from './routes/fila.routes'
import ofertaRoutes from './routes/oferta.routes'
import dashboardRoutes from './routes/dashboard.routes'

// Aceita origens definidas via CORS_ORIGIN (separadas por vírgula) ou usa os
// padrões de desenvolvimento (Vite :5173) e Docker (Nginx :8080).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:8080']

const app = express()
app.use(
  cors({
    origin: (origin, callback) => {
      // origin é undefined em chamadas server-to-server (ex: health-check)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS bloqueado para origem: ${origin}`))
      }
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/prontuarios', prontuarioRoutes)
app.use('/agenda', agendaRoutes)
app.use('/fila', filaRoutes)
app.use('/ofertas', ofertaRoutes)
app.use('/dashboard', dashboardRoutes)

export default app