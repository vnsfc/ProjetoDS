import { Request, Response } from 'express'
import { ProntuarioRepository } from '../repositories/ProntuarioRepository'
import { FilaEsperaService } from '../services/FilaEsperaService'
import { AgendaRepository } from '../repositories/AgendaRepository'
import prisma from '../lib/prisma'

// Remove a senha antes de retornar usuários no dashboard do ADMIN
const omitirSenha = (u: any) => {
  const { senha, ...resto } = u
  return resto
}

export const DashboardController = {
  // GET /dashboard/estudante — retorna apenas os prontuários do próprio estudante
  estudante: async (req: Request, res: Response): Promise<void> => {
    try {
      const estudanteId = (req as any).usuario.id
      const prontuarios = await ProntuarioRepository.listarPorAluno(estudanteId)
      res.json({ prontuarios })
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  // GET /dashboard/professor — prontuários de todos os alunos + fila de espera
  professor: async (req: Request, res: Response): Promise<void> => {
    try {
      const [prontuarios, fila] = await Promise.all([
        ProntuarioRepository.listarTodos(),
        FilaEsperaService.listarOrdenada(),
      ])
      res.json({ prontuarios, fila })
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  // GET /dashboard/napa — fila de espera + ofertas de consulta
  napa: async (req: Request, res: Response): Promise<void> => {
    try {
      const [fila, ofertas] = await Promise.all([
        FilaEsperaService.listarOrdenada(),
        AgendaRepository.listarOfertas(),
      ])
      res.json({ fila, ofertas })
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },

  // GET /dashboard/admin — visão completa: prontuários + fila + ofertas + usuários
  admin: async (req: Request, res: Response): Promise<void> => {
    try {
      const [prontuarios, fila, ofertas, usuariosRaw] = await Promise.all([
        ProntuarioRepository.listarTodos(),
        FilaEsperaService.listarOrdenada(),
        AgendaRepository.listarOfertas(),
        prisma.usuario.findMany({ orderBy: { nome: 'asc' } }),
      ])
      res.json({
        prontuarios,
        fila,
        ofertas,
        usuarios: usuariosRaw.map(omitirSenha),
      })
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
}
