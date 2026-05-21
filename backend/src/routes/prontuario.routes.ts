import { Router } from 'express'
import { ProntuarioController } from '../controllers/ProntuarioController'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()
//todas as rotas exigem login
router.use(autenticar)
//criar prontuário: só ESTUDANTE
router.post('/', autorizar('ESTUDANTE'), ProntuarioController.criar)
//Listar: cada perfil vê o que pode 
router.get('/', ProntuarioController.listar)
//Buscar por ID: qualquer autenticado
router.get('/:id', ProntuarioController.buscarPorId)
//Editar: só ESTUDANTE dono do prontuário 
router.put('/:id', autorizar('ESTUDANTE'), ProntuarioController.atualizar)
//Assinar: só PROFESSOR
router.post('/:id/assinar', autorizar('PROFESSOR'), ProntuarioController.assinar)
export default router