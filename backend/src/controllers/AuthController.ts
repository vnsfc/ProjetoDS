import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'

export const AuthController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, senha } = req.body
      const resultado = await AuthService.login(email, senha)
      res.json(resultado)
    } catch (error: any) {
      res.status(401).json({ erro: error.message })
    }
  }
}