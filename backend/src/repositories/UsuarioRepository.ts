import prisma from '../lib/prisma'

export const UsuarioRepository = {
  buscarPorEmail: async (email: string) => {
    return prisma.usuario.findUnique({ where: { email } })
  },
  salvar: async (data: { nome: string; email: string; senha: string; perfil: string }) => {
    return prisma.usuario.create({ data })
  },
  buscarPorId: async (id: number) => {
    return prisma.usuario.findUnique({ where: { id } })
  }
}