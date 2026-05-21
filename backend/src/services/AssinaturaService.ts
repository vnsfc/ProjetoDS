import { ProntuarioRepository } from '../repositories/ProntuarioRepository'
import { Perfil } from '../types/types'

export const AssinaturaService = {
  assinar: async (prontuarioId: number, professorId: number, perfilSolicitante: Perfil) => {
    //só PROFESSOR pode assinar
    if (perfilSolicitante !== 'PROFESSOR') {
      throw new Error('Apenas professores podem assinar prontuários')
    }
    const prontuario = await ProntuarioRepository.buscarPorId(prontuarioId)
    if (!prontuario) throw new Error('Prontuário não encontrado')
    //impede assinar um prontuário que já está assinado ou arquivado
    if (prontuario.status === 'ASSINADO') {
      throw new Error('Prontuário já foi assinado')
    }
    if (prontuario.status === 'ARQUIVADO') {
      throw new Error('Prontuário arquivado não pode ser assinado')
    }
    //atualiza: status = ASSINADO, vincula o professor
    return ProntuarioRepository.atualizar(prontuarioId, {
      status: 'ASSINADO',
      professorId
    })
  }
}