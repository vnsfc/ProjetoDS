import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import usuarioRoutes from './routes/usuario.routes'
import prontuarioRoutes from './routes/prontuario.routes'
import agendaRoutes from './routes/agenda.routes'
import filaRoutes from './routes/fila.routes'
import ofertaRoutes from './routes/oferta.routes'
import dashboardRoutes from './routes/dashboard.routes'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/prontuarios', prontuarioRoutes)
app.use('/agenda', agendaRoutes)
app.use('/fila', filaRoutes)
app.use('/ofertas', ofertaRoutes)
app.use('/dashboard', dashboardRoutes)

export default app