import { Request, Response } from 'express' 
import { AgendaService } from '../services/AgendaService'
import { FilaEsperaService } from '../services/FilaEsperaService'
import { FilaEsperaRepository } from '../repositories/FilaEsperaRepository'
//recebe os pedidos do frontend e devolve as respostas
//ele nao tem logica de negocio, so chama o service ou o repository certo
export const AgendaController = {
  criarEspera: async (req: Request, res: Response): Promise<void> => {
    try {
      const entrada = await FilaEsperaService.adicionar(req.body)
      res.status(201).json(entrada)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  listarEspera: async (req: Request, res: Response): Promise<void> => {
    try {
      const dataFiltro = req.query.data as string | undefined;
      const fila = await FilaEsperaService.listarOrdenada(dataFiltro)
      res.json(fila)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
  listarAgendamentos: async (req: Request, res: Response): Promise<void> => {
    try {
      const agendamentos = await AgendaService.listarAgendamentos((req as any).usuario);
      res.json(agendamentos);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  },
  atualizarStatusEspera: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const { status } = req.body
      const pacienteAtualizado = await FilaEsperaRepository.atualizarStatus(id, status)
      res.json(pacienteAtualizado)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
//efetiva o agendamento de um paciente em uma oferta disponivel (SCRUM-25)
//new Date() = converte a data que veio como texto do frontend para formato de data
  criarAgendamento: async (req: Request, res: Response): Promise<void> => {
    try {
      const novoAgendamento = await AgendaService.criarAgendamento(req.body, (req as any).usuario);
      res.status(201).json(novoAgendamento);
    } catch (error: any) {
      res.status(400).json({ erro: "Erro ao criar agendamento: " + error.message });
    }
  },
  cancelarAgendamento: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const agendamentoCancelado = await AgendaService.cancelarAgendamento(id);
      res.json(agendamentoCancelado);
    } catch (error: any) {
      res.status(400).json({ erro: "Erro ao cancelar agendamento: " + error.message });
    }
  }
}