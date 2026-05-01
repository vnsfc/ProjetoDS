import { Request, Response } from 'express'
import { UsuarioService } from '../services/UsuarioService'

export const UsuarioController = {
  cadastrar: async (req: Request, res: Response): Promise<void> => {
    try {
      const perfilSolicitante = (req as any).usuario?.perfil || 'ESTUDANTE'
      const usuario = await UsuarioService.cadastrar(req.body, perfilSolicitante)
      res.status(201).json(usuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  me: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).usuario?.id
      const usuario = await UsuarioService.buscarPorId(id)
      res.json(usuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  }
}