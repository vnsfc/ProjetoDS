import { AgendaRepository } from '../repositories/AgendaRepository'

export const AgendaService = {
  
  criarAgendamento: async (dados: { data: string; pacienteNome: string; usuarioId?: number }, usuarioLogado: any) => {
    const idResponsavel = usuarioLogado.perfil === 'ESTUDANTE' 
      ? usuarioLogado.id 
      : (dados.usuarioId || usuarioLogado.id)

    return AgendaRepository.salvarAgendamento({
      data: new Date(dados.data),
      pacienteNome: dados.pacienteNome,
      usuarioId: Number(idResponsavel)
    })
  },

  listarAgendamentos: async (usuarioLogado: any) => {
    const idFiltro = usuarioLogado.perfil === 'ESTUDANTE' ? usuarioLogado.id : undefined;
    return AgendaRepository.listarAgendamentos(idFiltro);
  },

  cancelarAgendamento: async (id: number) => {
    return AgendaRepository.atualizarStatus(id, 'CANCELADO');
  }
}