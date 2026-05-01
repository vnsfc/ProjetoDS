import { Request, Response } from 'express'
import { AgendaRepository } from '../repositories/AgendaRepository'
//camada do banco, usada aqui para buscar e salvar ofertas
//controller responsavel pelas ofertas de consulta (SCRUM-26)
//ofertas sao criadas pelo coordenador e visualizadas pelo NAPA para agendar pacientes
export const OfertaController = { 
  listar: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertas = await AgendaRepository.listarOfertas()
      res.json(ofertas)
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  },
//cria uma nova oferta de consulta no banco
//so NAPA e ADMIN podem chamar essa rota (protegida pelo autorizar() no arquivo de rotas)
//new Date() = converte a data que veio como texto para formato de data
  criar: async (req: Request, res: Response): Promise<void> => {
    try {
      const oferta = await AgendaRepository.salvarOferta({
        data: new Date(req.body.data),
        vagas: req.body.vagas //quantidade de pacientes que podem ser atendidos nessa oferta
      })
      res.status(201).json(oferta)   //status 201 = oferta criada com sucesso
    } catch (error: any) {
      res.status(400).json({ erro: error.message })
    }
  }
}