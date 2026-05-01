import { ProntuarioRepository } from '../repositories/ProntuarioRepository'

export const ProntuarioService = {
  criar: async (dados: { pacienteNome: string; anamnese?: string; procedimentos?: string; estudanteId: number }) => {
    if (!dados.pacienteNome || !dados.estudanteId) {
      throw new Error('Nome do paciente e estudante são obrigatórios')
    }
    return ProntuarioRepository.salvar(dados)
  },
  buscarPorId: async (id: number) => {
    const prontuario = await ProntuarioRepository.buscarPorId(id)
    if (!prontuario) throw new Error('Prontuário não encontrado')
    return prontuario
  },
  listarPorAluno: async (estudanteId: number) => {
    return ProntuarioRepository.listarPorAluno(estudanteId)
  },
  atualizar: async (id: number, dados: Partial<{ anamnese: string; procedimentos: string }>) => {
    const prontuario = await ProntuarioRepository.buscarPorId(id)
    if (!prontuario) throw new Error('Prontuário não encontrado')
    return ProntuarioRepository.atualizar(id, dados)
  }
}