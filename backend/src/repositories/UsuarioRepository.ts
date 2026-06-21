import prisma from '../lib/prisma'
import { DadosCadastro } from '../types/types'

const omitirSenha = (usuario: any) => {
  const { senha, ...resto } = usuario
  return resto
}

export const UsuarioRepository = {
  buscarPorEmail: async (email: string) => {
    return prisma.usuario.findUnique({ where: { email } })
  },

  buscarPorCpf: async (cpf: string) => {
    return prisma.usuario.findUnique({ where: { cpf } })
  },

  buscarPorId: async (id: number, incluirSenha = false) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) return null
    return incluirSenha ? usuario : omitirSenha(usuario)
  },

  listarTodos: async (busca?: string) => {
    const usuarios = await prisma.usuario.findMany({
      where: busca ? {
        OR: [
          { nome: { contains: busca } },
          { email: { contains: busca } }
        ]
      } : undefined,
      orderBy: { nome: 'asc' }
    })
    return usuarios.map(omitirSenha)
  },

  atualizar: async (id: number, data: Record<string, any>) => {
    const d = data
    const campos: Record<string, any> = {}

    if (d.nome           !== undefined) campos.nome           = d.nome
    if (d.telefone       !== undefined) campos.telefone       = d.telefone ?? null
    if (d.nacionalidade  !== undefined) campos.nacionalidade  = d.nacionalidade ?? null
    if (d.cpf            !== undefined) campos.cpf            = d.cpf ?? null
    if (d.dataNascimento !== undefined) campos.dataNascimento = d.dataNascimento ? new Date(d.dataNascimento) : null
    if (d.clinicaAtuacao !== undefined) campos.clinicaAtuacao = d.clinicaAtuacao ?? null
    if (d.diasLivres     !== undefined) campos.diasLivres     = d.diasLivres ?? null
    if (d.senha          !== undefined) campos.senha          = d.senha

    if (d.tipoEstagio       !== undefined) campos.tipoEstagio       = d.tipoEstagio ?? null
    if (d.nomeSupervisor    !== undefined) campos.nomeSupervisor    = d.nomeSupervisor ?? null
    if (d.nomeCurso         !== undefined) campos.nomeCurso         = d.nomeCurso ?? null
    if (d.periodoAtual      !== undefined) campos.periodoAtual      = d.periodoAtual ?? null
    if (d.previsaoConclusao !== undefined) campos.previsaoConclusao = d.previsaoConclusao ? new Date(d.previsaoConclusao) : null

    if (d.conselhoProfissional !== undefined) campos.conselhoProfissional = d.conselhoProfissional ?? null
    if (d.numeroRegistro       !== undefined) campos.numeroRegistro       = d.numeroRegistro ?? null
    if (d.estadoRegistro       !== undefined) campos.estadoRegistro       = d.estadoRegistro ?? null
    if (d.dataValidade         !== undefined) campos.dataValidade         = d.dataValidade ? new Date(d.dataValidade) : null

    const usuario = await prisma.usuario.update({ where: { id }, data: campos })
    return omitirSenha(usuario)
  },

  salvar: async (data: Omit<DadosCadastro, 'senha'> & { senha: string }) => {
    const d = data as any
    const usuario = await prisma.usuario.create({
      data: {
        nome:           d.nome,
        email:          d.email,
        senha:          d.senha,
        perfil:         d.perfil,
        nacionalidade:  d.nacionalidade || 'Brasileira',
        cpf:            d.cpf           || null,
        telefone:       d.telefone      || null,
        dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null,
        clinicaAtuacao: d.clinicaAtuacao || null,
        diasLivres:     d.diasLivres    || null,

        // Campos de Estudante
        tipoEstagio:       d.tipoEstagio       || null,
        nomeSupervisor:    d.nomeSupervisor    || null,
        nomeCurso:         d.nomeCurso         || null,
        periodoAtual:      d.periodoAtual      ? Number(d.periodoAtual) : null,
        previsaoConclusao: d.previsaoConclusao ? new Date(d.previsaoConclusao) : null,

        // Campos de Professor
        conselhoProfissional: d.conselhoProfissional || null,
        numeroRegistro:       d.numeroRegistro       || null,
        estadoRegistro:       d.estadoRegistro       || null,
        dataValidade:         d.dataValidade ? new Date(d.dataValidade) : null,
      }
    })
    return omitirSenha(usuario)
  },

  deletar: async (id: number) => {
    return prisma.usuario.delete({
      where: { id }
    });
  },
}
