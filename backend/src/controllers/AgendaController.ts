import { Request, Response } from 'express' 
import { AgendaRepository } from '../repositories/AgendaRepository'
import { FilaEsperaService } from '../services/FilaEsperaService'
import { FilaEsperaRepository } from '../repositories/FilaEsperaRepository'
import prisma from '../lib/prisma'
//recebe os pedidos do frontend e devolve as respostas
//ele nao tem logica de negocio, so chama o service ou o repository certo
export const AgendaController = {
  criarEspera: async (req: Request, res: Response): Promise<void> => { //cadastra um paciente na fila de espera (SCRUM-24)
    try {
      const entrada = await FilaEsperaService.adicionar(req.body)
      res.status(201).json(entrada)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  listarEspera: async (req: Request, res: Response): Promise<void> => {  //retorna a fila de espera ja ordenada por prioridade (SCRUM-24)
    try {
      const fila = await FilaEsperaService.listarOrdenada()
      res.json(fila)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  listarAgendamentos: async (req: Request, res: Response): Promise<void> => {
  try {
    const agendamentos = await AgendaRepository.listarAgendamentos()
    res.json(agendamentos)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
},
  atualizarStatusEspera: async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const { status } = req.body
    
    const pacienteAtualizado = await FilaEsperaRepository.atualizarStatus(id, status)
    res.json(pacienteAtualizado)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
},
//efetiva o agendamento de um paciente em uma oferta disponivel (SCRUM-25)
//new Date() = converte a data que veio como texto do frontend para formato de data
  criarAgendamento: async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, pacienteNome, usuarioId } = req.body
      const usuarioLogado = (req as any).usuario

      // Regra de negócio: Estudante só pode marcar para si mesmo
      const idResponsavel = usuarioLogado.perfil === 'ESTUDANTE' 
        ? usuarioLogado.id 
        : (usuarioId || usuarioLogado.id)

      const novoAgendamento = await AgendaRepository.salvarAgendamento({
        data: new Date(data),
        pacienteNome,
        usuarioId: Number(idResponsavel)
      })
      res.status(201).json(novoAgendamento)
    } catch (error: any) {
      res.status(400).json({ erro: "Erro ao criar agendamento: " + error.message })
    }
  }
}