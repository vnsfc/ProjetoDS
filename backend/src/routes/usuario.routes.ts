import { Router } from 'express'
import { UsuarioController } from '../controllers/UsuarioController'
import { autenticar } from '../middlewares/authRoles'

const router = Router()

router.post('/cadastro', UsuarioController.cadastrar)
router.get('/me', autenticar, UsuarioController.me)

export default router