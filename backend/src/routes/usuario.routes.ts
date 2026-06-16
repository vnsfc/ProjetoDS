import { Router } from 'express'
import { UsuarioController } from '../controllers/UsuarioController'
import { autenticar, autorizar } from '../middlewares/authRoles'
const router = Router()
//Cadastro público, qualquer um pode se cadastrar como ESTUDANTE
//ADMIN pode chamar esta rota com token para cadastrar PROFESSOR/NAPA/ADMIN
router.post('/cadastro', UsuarioController.cadastrar)
router.get('/me', autenticar, UsuarioController.me)
router.get('/', autenticar, autorizar('ADMIN'), UsuarioController.listarTodos)
router.get('/:id', autenticar, autorizar('ADMIN'), UsuarioController.buscarPorId)
export default router