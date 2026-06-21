import { Request, Response } from 'express'
import { UsuarioService } from '../services/UsuarioService'
import { DadosCadastro, Perfil } from '../types/types'

export const UsuarioController = {
  cadastrar: async (req: Request, res: Response): Promise<void> => {
    try {
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
      const { id, perfil } = (req as any).usuario
      const usuario = await UsuarioService.buscarPorId(id, id, perfil)
      res.json(usuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  },

  atualizarMe: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = (req as any).usuario
      const usuario = await UsuarioService.atualizar(id, req.body)
      res.json(usuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  listarTodos: async (req: Request, res: Response): Promise<void> => {
    try {
      const busca = req.query.busca as string | undefined
      const usuarios = await UsuarioService.listarTodos(busca)
      res.json(usuarios)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  buscarPorId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, perfil } = (req as any).usuario
      const idAlvo = Number(req.params.id)
      const usuario = await UsuarioService.buscarPorId(idAlvo, id, perfil)
      res.json(usuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  },

  atualizarPorId: async (req: Request, res: Response): Promise<void> => {
    try {
      const idAlvo = Number(req.params.id);
      const dados = req.body;
      const usuarioAtualizado = await UsuarioService.atualizar(idAlvo, dados);
      res.json(usuarioAtualizado);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  },

  deletar: async (req: Request, res: Response): Promise<void> => {
    try {
      const idAlvo = Number(req.params.id);
      await UsuarioService.deletar(idAlvo);
      res.status(204).send(); 
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }
}
