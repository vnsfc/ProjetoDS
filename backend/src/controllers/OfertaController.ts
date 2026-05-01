import { Request, Response } from 'express'
import { AgendaRepository } from '../repositories/AgendaRepository'

export const OfertaController = {
  listar: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertas = await AgendaRepository.listarOfertas()
      res.json(ofertas)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  criar: async (req: Request, res: Response): Promise<void> => {
    try {
      const oferta = await AgendaRepository.salvarOferta({
        data: new Date(req.body.data),
        vagas: req.body.vagas
      })
      res.status(201).json(oferta)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  }
}