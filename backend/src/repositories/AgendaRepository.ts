import prisma from '../lib/prisma'

export const AgendaRepository = {
  salvarAgendamento: async (data: { data: Date; status: string }) => {
    return prisma.agenda.create({ data })
  },
  listarAgendamentos: async () => {
    return prisma.agenda.findMany()
  },
  listarOfertas: async () => {
    return prisma.oferta.findMany()
  },
  salvarOferta: async (data: { data: Date; vagas: number }) => {
    return prisma.oferta.create({ data })
  }
}