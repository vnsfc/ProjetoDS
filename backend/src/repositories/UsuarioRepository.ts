import prisma from '../lib/prisma'
import { DadosCadastro } from '../types/types'

export const UsuarioRepository = {
  buscarPorEmail: async (email: string) => {
    return prisma.usuario.findUnique({ where: { email } })
  },

  buscarPorCpf: async (cpf: string) => {
    return prisma.usuario.findUnique({ where: { cpf } })
  },

  buscarPorId: async (id: number) => {
    return prisma.usuario.findUnique({ where: { id } })
  },

  salvar: async (data: Omit<DadosCadastro, 'senha'> & { senha: string }) => {
    const d = data as any

    return prisma.usuario.create({
      data: {
        nome:d.nome,
        email: d.email,
        senha: d.senha,
        perfil: d.perfil,
        nacionalidade:  d.nacionalidade ?? 'Brasileira',
        cpf: d.cpf ?? null,
        telefone:  d.telefone ?? null,
        dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null,
        clinicaAtuacao: d.clinicaAtuacao ?? null,
        diasLivres: d.diasLivres ?? null,

        //ESTUDANTE
        tipoEstagio: d.tipoEstagio ?? null,
        nomeSupervisor: d.nomeSupervisor ?? null,
        nomeCurso:  d.nomeCurso  ?? null,
        periodoAtual: d.periodoAtual ?? null,
        previsaoConclusao: d.previsaoConclusao ? new Date(d.previsaoConclusao) : null,

        //PROFESSOR
        conselhoProfissional: d.conselhoProfissional ?? null,
        numeroRegistro: d.numeroRegistro ?? null,
        estadoRegistro: d.estadoRegistro ?? null,
        dataValidade: d.dataValidade ? new Date(d.dataValidade) : null,
      }
    })
  }
}