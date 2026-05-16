import { Request, Response } from 'express'
import { UsuarioService } from '../services/UsuarioService'
import { DadosCadastro, Perfil } from '../types/types' 

export const UsuarioController = {
  cadastrar: async (req: Request, res: Response): Promise<void> => {
    try {
      //se não há usuário logado (cadastro público), assume ESTUDANTE como solicitante
      //assim só ESTUDANTE pode se auto-cadastrar; PROFESSOR/NAPA/ADMIN precisam de token de ADMIN
      const perfilSolicitante: Perfil = (req as any).usuario?.perfil ?? 'ESTUDANTE'
 
      const dados = req.body as DadosCadastro
      const usuario = await UsuarioService.cadastrar(dados, perfilSolicitante)
 
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