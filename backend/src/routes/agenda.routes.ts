import { Router } from 'express'
import { AgendaController } from '../controllers/AgendaController'
import { AgendaRepository } from '../repositories/AgendaRepository'
import { autenticar } from '../middlewares/authRoles'
//Router = mini servidor de rotas do Express
//cada arquivo de rotas cuida de um dominio separado
//autenticar = middleware que verifica se o usuario esta logado
//sem token valido, a requisicao e bloqueada antes de chegar no controller
const router = Router() //aplica o middleware em TODAS as rotas abaixo
router.use(autenticar) //obs: nenhuma rota de agendamento funciona sem estar logado
router.post('/espera', AgendaController.criarEspera) //cadastra paciente na fila de espera (SCRUM-24)
router.get('/espera', AgendaController.listarEspera) //lista a fila ordenada por prioridade (SCRUM-24)
router.post('/', AgendaController.criarAgendamento) // efetiva o agendamento de um paciente (SCRUM-25)
router.get('/', async (req, res) => {
  try {
    const agendamentos = await AgendaRepository.listarAgendamentos()
    res.json(agendamentos)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
})
export default router