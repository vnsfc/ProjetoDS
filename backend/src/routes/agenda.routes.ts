import { Router } from 'express'
import { AgendaController } from '../controllers/AgendaController'
import { autenticar } from '../middlewares/authRoles'

const router = Router()

router.use(autenticar)

router.post('/espera', AgendaController.criarEspera)
router.get('/espera', AgendaController.listarEspera)
router.post('/', AgendaController.criarAgendamento)

export default router