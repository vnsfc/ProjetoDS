import prisma from '../lib/prisma'

export const FilaEsperaRepository = {
  buscarFila: async (inicioDia?: Date, fimDia?: Date) => {
    const where = inicioDia && fimDia ? {
      createdAt: {
        gte: inicioDia,
        lte: fimDia
      }
    } : undefined;

    return prisma.filaEspera.findMany({ where })
  },
  adicionar: async (data: { pacienteNome: string; prioridade: string }) => {
    return prisma.filaEspera.create({ data })
  },
  remover: async (id: number) => {
    return prisma.filaEspera.delete({ where: { id } })
  },
  atualizarStatus: async (id: number, status: string) => {
    return prisma.filaEspera.update({
      where: { id },
      data: { status }
    })
  }
}