import { Router } from 'express'
import { ProntuarioController } from '../controllers/ProntuarioController'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()

router.use(autenticar)

router.post('/', autorizar('ESTUDANTE'), ProntuarioController.criar)
router.get('/', ProntuarioController.listarMeus)
router.get('/:id', ProntuarioController.buscarPorId)
router.put('/:id', autorizar('ESTUDANTE'), ProntuarioController.atualizar)
router.post('/:id/assinar', autorizar('PROFESSOR'), ProntuarioController.assinar)

export default router