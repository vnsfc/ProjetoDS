import { FilaEsperaRepository } from '../repositories/FilaEsperaRepository'

const PRIORIDADE_ORDEM: Record<string, number> = {
  URGENTE: 1,
  NORMAL: 2,
  ELETIVO: 3
}

export const FilaEsperaService = {
  listarOrdenada: async () => {
    const fila = await FilaEsperaRepository.buscarFila()
    return fila.sort((a, b) => {
      return (PRIORIDADE_ORDEM[a.prioridade] ?? 99) - (PRIORIDADE_ORDEM[b.prioridade] ?? 99)
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