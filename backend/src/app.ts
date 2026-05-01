import express from 'express'
import authRoutes from './routes/auth.routes'
import usuarioRoutes from './routes/usuario.routes'
import prontuarioRoutes from './routes/prontuario.routes'
import agendaRoutes from './routes/agenda.routes'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/prontuarios', prontuarioRoutes)
app.use('/agenda', agendaRoutes)

export default app