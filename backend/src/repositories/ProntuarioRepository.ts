import prisma from '../lib/prisma'

export const ProntuarioRepository = {
  salvar: async (data: { pacienteNome: string; anamnese?: string; procedimentos?: string; estudanteId: number }) => {
    return prisma.prontuario.create({ data })
  },
  buscarPorId: async (id: number) => {
    return prisma.prontuario.findUnique({ where: { id } })
  },
  listarPorAluno: async (estudanteId: number) => {
    return prisma.prontuario.findMany({ where: { estudanteId } })
  },
  atualizar: async (id: number, data: Partial<{ anamnese: string; procedimentos: string; assinado: boolean; professorId: number }>) => {
    return prisma.prontuario.update({ where: { id }, data })
  }
}