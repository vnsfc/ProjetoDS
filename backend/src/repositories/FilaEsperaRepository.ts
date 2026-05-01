import prisma from '../lib/prisma'

export const FilaEsperaRepository = {
  buscarFila: async () => {
    return prisma.filaEspera.findMany()
  },
  adicionar: async (data: { pacienteNome: string; prioridade: string }) => {
    return prisma.filaEspera.create({ data })
  },
  remover: async (id: number) => {
    return prisma.filaEspera.delete({ where: { id } })
  }
}