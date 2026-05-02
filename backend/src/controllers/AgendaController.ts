import { Request, Response } from 'express'
import { AgendaRepository } from '../repositories/AgendaRepository'
import { FilaEsperaService } from '../services/FilaEsperaService'

export const AgendaController = {
  criarEspera: async (req: Request, res: Response): Promise<void> => {
    try {
      const entrada = await FilaEsperaService.adicionar(req.body)
      res.status(201).json(entrada)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  listarEspera: async (req: Request, res: Response): Promise<void> => {
    try {
      const fila = await FilaEsperaService.listarOrdenada()
      res.json(fila)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  criarAgendamento: async (req: Request, res: Response): Promise<void> => {
    try {
      const agendamento = await AgendaRepository.salvarAgendamento({
        data: new Date(req.body.data),
        status: 'AGENDADO'
      })
      res.status(201).json(agendamento)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  }
}