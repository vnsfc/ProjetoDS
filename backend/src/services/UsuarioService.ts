import { UsuarioRepository } from '../repositories/UsuarioRepository'
import { AuthService } from './AuthService'
import { DadosCadastro, Perfil } from '../types/types'

export const UsuarioService = {
  cadastrar: async (dados: DadosCadastro, perfilSolicitante: Perfil) => {
    if (dados.perfil === 'PROFESSOR' && perfilSolicitante !== 'ADMIN') {
      throw new Error('Apenas administradores podem cadastrar professores')
    }
    if ((dados.perfil === 'ADMIN' || dados.perfil === 'NAPA') && perfilSolicitante !== 'ADMIN') {
      throw new Error('Apenas administradores podem cadastrar este perfil')
    }
    const emailExistente = await UsuarioRepository.buscarPorEmail(dados.email)
    if (emailExistente) throw new Error('Email ja cadastrado')
    if (dados.cpf) {
      const cpfExistente = await UsuarioRepository.buscarPorCpf(dados.cpf)
      if (cpfExistente) throw new Error('CPF ja cadastrado')
    }
    validarCamposPorPerfil(dados)
    const senhaHash = await AuthService.hashSenha(dados.senha)
    return UsuarioRepository.salvar({ ...dados, senha: senhaHash })
  },

  buscarPorId: async (idAlvo: number, idSolicitante: number, perfilSolicitante: string) => {
    const incluirSenha = perfilSolicitante === 'ADMIN' || idSolicitante === idAlvo
    const usuario = await UsuarioRepository.buscarPorId(idAlvo, incluirSenha)
    if (!usuario) throw new Error('Usuario nao encontrado')
    return usuario
  },

  listarTodos: async (busca?: string) => {
    return UsuarioRepository.listarTodos(busca)
  },

  atualizar: async (idAlvo: number, dados: Record<string, any>, perfilSolicitante: string) => {
    const usuario = await UsuarioRepository.buscarPorId(idAlvo, true)
    if (!usuario) throw new Error('Usuario nao encontrado')

    const update: Record<string, any> = { ...dados }

    if (dados.cpf && dados.cpf !== (usuario as any).cpf) {
      const cpfExistente = await UsuarioRepository.buscarPorCpf(dados.cpf)
      if (cpfExistente) throw new Error('CPF ja cadastrado por outro usuario')
    }

    if (dados.novaSenha !== undefined) {
      if (!dados.senhaAtual) throw new Error('Informe a senha atual para alterar a senha')
      const bcrypt = await import('bcrypt')
      const senhaCorreta = await bcrypt.compare(dados.senhaAtual, (usuario as any).senha)
      if (!senhaCorreta) throw new Error('Senha atual incorreta')
      update.senha = await AuthService.hashSenha(dados.novaSenha)
    }

    delete update.senhaAtual
    delete update.novaSenha
    if (perfilSolicitante !== 'ADMIN') {
      delete update.perfil
    }
    delete update.email

    return UsuarioRepository.atualizar(idAlvo, update)
  },

  deletar: async (idAlvo: number) => {
    // Verifica se o usuário existe
    const usuario = await UsuarioRepository.buscarPorId(idAlvo, false);
    if (!usuario) throw new Error('Usuário não encontrado');
    return UsuarioRepository.deletar(idAlvo);
  }
}

function validarCamposPorPerfil(dados: DadosCadastro) {
  if (dados.perfil === 'ESTUDANTE') {
    if (!dados.tipoEstagio) throw new Error('Campo obrigatorio: tipoEstagio')
    if (!dados.nomeCurso) throw new Error('Campo obrigatorio: nomeCurso')
    if (!dados.nomeSupervisor) throw new Error('Campo obrigatorio: nomeSupervisor')
    if (dados.periodoAtual == null) throw new Error('Campo obrigatorio: periodoAtual')
    if (!dados.previsaoConclusao) throw new Error('Campo obrigatorio: previsaoConclusao')
  }
  if (dados.perfil === 'PROFESSOR') {
    if (!dados.conselhoProfissional) throw new Error('Campo obrigatorio: conselhoProfissional')
    if (!dados.numeroRegistro) throw new Error('Campo obrigatorio: numeroRegistro')
    if (!dados.estadoRegistro) throw new Error('Campo obrigatorio: estadoRegistro')
    if (!dados.dataValidade) throw new Error('Campo obrigatorio: dataValidade')
  }
}
