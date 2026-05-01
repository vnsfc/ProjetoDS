import prisma from '../lib/prisma'
//unico arquivo que fala direto com o banco
// nenhuma logica de negocio aqui, so salvar e buscar dados
export const AgendaRepository = {
//cria um novo registro de agendamento no banco
// recebe a data e define o status como 'AGENDADO' automaticamente
  salvarAgendamento: async (data: { data: Date; status: string }) => {
    return prisma.agenda.create({ data })
  },
//busca todos os agendamentos cadastrados no banco
//retorna um array com todos os registros da tabela agenda
  listarAgendamentos: async () => {
    return prisma.agenda.findMany()
  },
//busca todas as ofertas de consulta disponiveis
//ofertas sao criadas pelo coordenador e consumidas pelo NAP  
  listarOfertas: async () => {
    return prisma.oferta.findMany()
  },
//cria uma nova oferta de consulta no banco
//recebe a data e a quantidade de vagas disponiveis
  salvarOferta: async (data: { data: Date; vagas: number }) => {
    return prisma.oferta.create({ data })
  }
}