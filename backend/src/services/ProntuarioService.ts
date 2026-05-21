import { ProntuarioRepository } from '../repositories/ProntuarioRepository'

export const ProntuarioService = {
  criar: async (dados: {
    pacienteNome: string
    evolucaoClinica: string
    procedimentos?: string
    examesSolicitados?: string
    prescricoes?: string
    estudanteId: number
  }) => {
    //obrigatórios
    if (!dados.pacienteNome)    throw new Error('Campo obrigatório: pacienteNome')
    if (!dados.evolucaoClinica) throw new Error('Campo obrigatório: evolucaoClinica')
    if (!dados.estudanteId)     throw new Error('Estudante não identificado')
    return ProntuarioRepository.salvar({
      ...dados,
      dataAtendimento: new Date()
    })
  },

  buscarPorId: async (id: number) => {
    const prontuario = await ProntuarioRepository.buscarPorId(id)
    if (!prontuario) throw new Error('Prontuário não encontrado')
    return prontuario
  },
  listarPorAluno: async (estudanteId: number) => {
    return ProntuarioRepository.listarPorAluno(estudanteId)
  },

  listarTodos: async () => {
    return ProntuarioRepository.listarTodos()
  },

  atualizar: async (
    id: number,
    dados: Partial<{
      evolucaoClinica: string
      procedimentos: string
      examesSolicitados: string
      prescricoes: string
    }>,
    estudanteId: number
  ) => {
    const prontuario = await ProntuarioRepository.buscarPorId(id)
    if (!prontuario) throw new Error('Prontuário não encontrado')

    //estudante só pode editar prontuários próprios
    if (prontuario.estudanteId !== estudanteId) {
      throw new Error('Você não tem permissão para editar este prontuário')
    }
    //prontuário assinado não pode ser editado
    if (prontuario.status === 'ASSINADO') {
      throw new Error('Prontuário já assinado não pode ser editado')
    }
    return ProntuarioRepository.atualizar(id, dados)
  }
}