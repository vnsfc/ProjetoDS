import { ProntuarioRepository } from '../repositories/ProntuarioRepository'
import { Perfil } from '../types/types'

export const AssinaturaService = {
  assinar: async (prontuarioId: number, professorId: number, perfilSolicitante: Perfil) => {
    if (perfilSolicitante !== 'PROFESSOR') {
      throw new Error('Apenas professores podem assinar prontuários')
    }
    const prontuario = await ProntuarioRepository.buscarPorId(prontuarioId)
    if (!prontuario) throw new Error('Prontuário não encontrado')
    if (prontuario.assinado) throw new Error('Prontuário já foi assinado')

    return ProntuarioRepository.atualizar(prontuarioId, { assinado: true, professorId })
  }
}
