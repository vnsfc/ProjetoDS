import { Request, Response } from 'express'
import { UsuarioService } from '../services/UsuarioService'
import { DadosCadastro, Perfil } from '../types/types'

export const UsuarioController = {
  cadastrar: async (req: Request, res: Response): Promise<void> => {
    try {
      // Sem token = ESTUDANTE; com token de ADMIN = pode cadastrar qualquer perfil
      const perfilSolicitante: Perfil = (req as any).usuario?.perfil ?? 'ESTUDANTE'
      const dados = req.body as DadosCadastro
      const usuario = await UsuarioService.cadastrar(dados, perfilSolicitante)
      res.status(201).json(usuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  // Retorna dados do próprio usuário logado — inclui senha pois é o dono da conta
  me: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, perfil } = (req as any).usuario
      const usuario = await UsuarioService.buscarPorId(id, id, perfil)
      res.json(usuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  },

  // Lista todos os usuários — só ADMIN
  // Aceita ?busca=termo para filtrar por nome ou email
  // Exemplo: GET /usuarios?busca=joao ou GET /usuarios?busca=@ufpe.br
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
}
}