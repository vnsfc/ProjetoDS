import { Router } from 'express'
import { UsuarioController } from '../controllers/UsuarioController'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()

router.post('/cadastro', UsuarioController.cadastrar)

router.get('/me', autenticar, UsuarioController.me)
router.put('/me', autenticar, UsuarioController.atualizarMe)

router.get('/', autenticar, autorizar('ADMIN'), UsuarioController.listarTodos)
router.get('/:id', autenticar, autorizar('ADMIN'), UsuarioController.buscarPorId)

export default router
