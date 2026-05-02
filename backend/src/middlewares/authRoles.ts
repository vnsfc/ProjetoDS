import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const autenticar = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ erro: 'Token não fornecido' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    ;(req as any).usuario = payload
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido' })
  }
}

export const autorizar = (...perfis: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const perfil = (req as any).usuario?.perfil
    if (!perfis.includes(perfil)) {
      res.status(403).json({ erro: 'Acesso negado' })
      return
    }
    next()
  }
}