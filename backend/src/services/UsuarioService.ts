import { UsuarioRepository } from '../repositories/UsuarioRepository'
import { AuthService } from './AuthService'

export const UsuarioService = {
  cadastrar: async (dados: { nome: string; email: string; senha: string; perfil: string }, perfilSolicitante: string) => {
    if (dados.perfil === 'PROFESSOR' && perfilSolicitante !== 'ADMIN') {
      throw new Error('Apenas administradores podem cadastrar professores')
    }
    const existente = await UsuarioRepository.buscarPorEmail(dados.email)
    if (existente) throw new Error('Email já cadastrado')

    const senhaHash = await AuthService.hashSenha(dados.senha)
    return UsuarioRepository.salvar({ ...dados, senha: senhaHash })
  },
  buscarPorId: async (id: number) => {
    const usuario = await UsuarioRepository.buscarPorId(id)
    if (!usuario) throw new Error('Usuário não encontrado')
    return usuario
  }
}