import { Request, Response } from 'express'
import { ProntuarioService } from '../services/ProntuarioService'
import { AssinaturaService } from '../services/AssinaturaService'

export const ProntuarioController = {
  //Cria um novo prontuário no sistema, restrição: Apenas usuários com perfil 'ESTUDANTE'
  criar: async (req: Request, res: Response): Promise<void> => {
    try {
      const estudanteId = (req as any).usuario?.id
      const prontuario = await ProntuarioService.criar({ ...req.body, estudanteId })
      res.status(201).json(prontuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  //Busca um prontuário específico através do ID
  buscarPorId: async (req: Request, res: Response): Promise<void> => {
    try {
      const prontuario = await ProntuarioService.buscarPorId(Number(req.params.id))
      res.json(prontuario)
    } catch (error: any) {
      res.status(404).json({ erro: error.message })
    }
  },

  //Lista os prontuários de acordo com o perfil do usuário logado, estudante vê apenas os seus; Professor, Admin e NAPA veem todos
  listar: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, perfil } = (req as any).usuario
      if (perfil === 'ESTUDANTE') {
        const prontuarios = await ProntuarioService.listarPorAluno(id)
        res.json(prontuarios)
      } else {
        //PROFESSOR, ADMIN, NAPA (sem dados clínicos detalhados para NAPA,controle no frontend)
        const prontuarios = await ProntuarioService.listarTodos()
        res.json(prontuarios)
      }
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  //Atualiza os dados de um prontuário existente, apenas o ESTUDANTE que é dono (criador) do prontuário.
  atualizar: async (req: Request, res: Response): Promise<void> => {
    try {
      const estudanteId = (req as any).usuario?.id
      const prontuario = await ProntuarioService.atualizar(
        Number(req.params.id),
        req.body,
        estudanteId
      )
      res.json(prontuario)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  //Realiza a assinatura digital/eletrônica de um prontuário, apenas usuários com perfil 'PROFESSOR'
  assinar: async (req: Request, res: Response): Promise<void> => {
    try {
      const professorId = (req as any).usuario?.id
      const perfilSolicitante = (req as any).usuario?.perfil
      const prontuario = await AssinaturaService.assinar(
        Number(req.params.id),
        professorId,
        perfilSolicitante
      )
      res.json(prontuario)
    } catch (error: any) {
      res.status(403).json({ erro: error.message })
    }
  },
  arquivar: async (req: Request, res: Response): Promise<void> => {
  try {
    const perfil = (req as any).usuario?.perfil
    const prontuario = await ProntuarioService.arquivar(Number(req.params.id), perfil)
    res.json(prontuario)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}
}