import { Request, Response } from 'express'
import { ProntuarioService } from '../services/ProntuarioService'
import { AssinaturaService } from '../services/AssinaturaService'

export const ProntuarioController = {
  criar: async (req: Request, res: Response): Promise<void> => {
    try {
      const estudanteId = (req as any).usuario?.id
      const prontuario = await ProntuarioService.criar({ ...req.body, estudanteId })
      res.status(201).json(prontuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  buscarPorId: async (req: Request, res: Response): Promise<void> => {
    try {
      const prontuario = await ProntuarioService.buscarPorId(Number(req.params.id))
      res.json(prontuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  },
  listarMeus: async (req: Request, res: Response): Promise<void> => {
    try {
      const estudanteId = (req as any).usuario?.id
      const prontuarios = await ProntuarioService.listarPorAluno(estudanteId)
      res.json(prontuarios)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  atualizar: async (req: Request, res: Response): Promise<void> => {
    try {
      const prontuario = await ProntuarioService.atualizar(Number(req.params.id), req.body)
      res.json(prontuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  assinar: async (req: Request, res: Response): Promise<void> => {
    try {
      const professorId = (req as any).usuario?.id
      const perfilSolicitante = (req as any).usuario?.perfil
      const prontuario = await AssinaturaService.assinar(Number(req.params.id), professorId, perfilSolicitante)
      res.json(prontuario)
    } catch (error: any) {
      res.status(403).json({ erro: error.message })
    }
  }
}