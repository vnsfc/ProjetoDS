import prisma from '../lib/prisma'
//Tipo para criação do prontuário
type DadosCriarProntuario = {
  pacienteNome: string
  evolucaoClinica: string  //obrigatório
  procedimentos?: string
  examesSolicitados?: string      
  prescricoes?: string            
  dataAtendimento?: Date
  estudanteId: number
}

//tipo para atualização parcial (só campos editáveis pelo estudante)
type DadosAtualizarProntuario = Partial<{
  evolucaoClinica: string
  procedimentos: string
  examesSolicitados: string
  prescricoes: string
  status: string
  professorId: number
}>

export const ProntuarioRepository = {
  salvar: async (data: DadosCriarProntuario) => {
    return prisma.prontuario.create({ data })
  },

  buscarPorId: async (id: number) => {
    return prisma.prontuario.findUnique({
      where: { id },
      include: {
        estudante: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } }
      }
    })
  },

  listarPorAluno: async (estudanteId: number) => {
    return prisma.prontuario.findMany({
      where: { estudanteId },
      orderBy: { dataAtendimento: 'desc' }
    })
  },

  listarTodos: async () => {
    return prisma.prontuario.findMany({
      orderBy: { dataAtendimento: 'desc' },
      include: {
        estudante: { select: { id: true, nome: true } },
        professor: { select: { id: true, nome: true } }
      }
    })
  },

  atualizar: async (id: number, data: DadosAtualizarProntuario) => {
    return prisma.prontuario.update({ where: { id }, data })
  }
}