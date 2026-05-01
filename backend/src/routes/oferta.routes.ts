import { Router } from 'express'
import { OfertaController } from '../controllers/OfertaController'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()

router.use(autenticar)

router.get('/', OfertaController.listar)
router.post('/', autorizar('NAPA', 'ADMIN'), OfertaController.criar)

export default router