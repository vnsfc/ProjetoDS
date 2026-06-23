import { FilaEsperaRepository } from '../repositories/FilaEsperaRepository'

const PRIORIDADE_ORDEM: Record<string, number> = {
  URGENTE: 1,
  NORMAL: 2,
  ELETIVO: 3
}

export const FilaEsperaService = {
  listarOrdenada: async (dataFiltro?: string) => {
    let inicioDia, fimDia;
    
    if (dataFiltro) {
      const [ano, mes, dia] = dataFiltro.split('-').map(Number);
      inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
      fimDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
    }

    const fila = await FilaEsperaRepository.buscarFila(inicioDia, fimDia)
    
    return fila.sort((a, b) => {
      const aChamado = a.status === 'CHAMADO' ? 1 : 0;
      const bChamado = b.status === 'CHAMADO' ? 1 : 0;
      if (aChamado !== bChamado) return aChamado - bChamado;

      const pA = PRIORIDADE_ORDEM[a.prioridade] ?? 99;
      const pB = PRIORIDADE_ORDEM[b.prioridade] ?? 99;
      if (pA !== pB) return pA - pB;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })
  },
  adicionar: async (dados: { pacienteNome: string; prioridade: string }) => {
    const prioridadesValidas = ['URGENTE', 'NORMAL', 'ELETIVO']
    if (!prioridadesValidas.includes(dados.prioridade)) {
      throw new Error('Prioridade inválida. Use URGENTE, NORMAL ou ELETIVO')
    }
    if (!dados.pacienteNome) throw new Error('Nome do paciente é obrigatório')
    return FilaEsperaRepository.adicionar(dados)
  },
  remover: async (id: number) => {
    return FilaEsperaRepository.remover(id)
  }
}