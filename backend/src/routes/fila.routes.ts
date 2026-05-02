import { Router } from 'express'
import { FilaEsperaService } from '../services/FilaEsperaService'
import { autenticar, autorizar } from '../middlewares/authRoles'

const router = Router()

router.use(autenticar)

router.get('/', autorizar('NAPA', 'PROFESSOR', 'ADMIN'), async (req, res): Promise<void> => {
  try {
    const fila = await FilaEsperaService.listarOrdenada()
    res.json(fila)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
})

router.delete('/:id', autorizar('NAPA', 'ADMIN'), async (req, res): Promise<void> => {
  try {
    await FilaEsperaService.remover(Number(req.params.id))
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
})

export default router