import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UsuarioRepository } from '../repositories/UsuarioRepository'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const AuthService = {
  hashSenha: async (senha: string) => {
    return bcrypt.hash(senha, 10)
  },
  login: async (email: string, senha: string) => {
    const usuario = await UsuarioRepository.buscarPorEmail(email)
    if (!usuario) throw new Error('Usuário não encontrado')

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) throw new Error('Senha incorreta')

    const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, JWT_SECRET, { expiresIn: '8h' })
    return { token, usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil } }
  }
}