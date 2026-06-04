import prisma from '../lib/prisma'
import { DadosCadastro } from '../types/types'

// Remove a senha do objeto antes de retornar para a API
// Usada em todas as consultas exceto no login (AuthService precisa da senha para comparar)
const omitirSenha = (usuario: any) => {
  const { senha, ...resto } = usuario
  return resto
}

export const UsuarioRepository = {
  // Mantém a senha — AuthService precisa dela para comparar no login
  buscarPorEmail: async (email: string) => {
    return prisma.usuario.findUnique({ where: { email } })
  },

  buscarPorCpf: async (cpf: string) => {
    return prisma.usuario.findUnique({ where: { cpf } })
  },

  // incluirSenha = true apenas quando o próprio usuário ou ADMIN pede seus dados
  buscarPorId: async (id: number, incluirSenha = false) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) return null
    return incluirSenha ? usuario : omitirSenha(usuario)
  },

  // busca? = filtro opcional por nome ou email (usado pela barra de pesquisa do ADMIN)
  listarTodos: async (busca?: string) => {
    const usuarios = await prisma.usuario.findMany({
      where: busca ? {
        OR: [
          { nome:  { contains: busca } },
          { email: { contains: busca } }
        ]
      } : undefined,
      orderBy: { nome: 'asc' }
    })
    return usuarios.map(omitirSenha) // senha nunca aparece na listagem
  },

  salvar: async (data: Omit<DadosCadastro, 'senha'> & { senha: string }) => {
    const d = data as any
    const usuario = await prisma.usuario.create({
      data: {
        nome:           d.nome,
        email:          d.email,
        senha:          d.senha,
        perfil:         d.perfil,
        nacionalidade:  d.nacionalidade ?? 'Brasileira',
        cpf:            d.cpf           ?? null,
        telefone:       d.telefone      ?? null,
        dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null,
        clinicaAtuacao: d.clinicaAtuacao ?? null,
        diasLivres:     d.diasLivres    ?? null,

        // ESTUDANTE
        tipoEstagio:       d.tipoEstagio       ?? null,
        nomeSupervisor:    d.nomeSupervisor    ?? null,
        nomeCurso:         d.nomeCurso         ?? null,
        periodoAtual:      d.periodoAtual      ?? null,
        previsaoConclusao: d.previsaoConclusao ? new Date(d.previsaoConclusao) : null,

        // PROFESSOR
        conselhoProfissional: d.conselhoProfissional ?? null,
        numeroRegistro:       d.numeroRegistro       ?? null,
        estadoRegistro:       d.estadoRegistro       ?? null,
        dataValidade:         d.dataValidade ? new Date(d.dataValidade) : null,
      }
    })
    return omitirSenha(usuario) // não retorna a senha após cadastro
  }
}