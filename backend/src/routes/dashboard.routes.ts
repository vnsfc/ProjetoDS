import { Router } from 'express'
import { DashboardController } from '../controllers/DashboardController'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()
router.use(autenticar) // todas as rotas exigem login

// Cada rota só é acessível pelo perfil correspondente
router.get('/estudante', autorizar('ESTUDANTE'), DashboardController.estudante)
router.get('/professor', autorizar('PROFESSOR'), DashboardController.professor)
router.get('/napa',      autorizar('NAPA'),      DashboardController.napa)
router.get('/admin',     autorizar('ADMIN'),      DashboardController.admin)

export default router
