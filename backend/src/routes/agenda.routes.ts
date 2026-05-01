import { Router } from 'express'
import { autenticar } from '../middlewares/authRoles'

const router = Router()

router.use(autenticar)

// TODO: Person 4 - implementar rotas de agenda e oferta

export default router