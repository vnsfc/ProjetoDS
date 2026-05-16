import { UsuarioRepository } from '../repositories/UsuarioRepository'
import { AuthService } from './AuthService'
import { DadosCadastro, Perfil } from '../types/types'

export const UsuarioService = {
  cadastrar: async (dados: DadosCadastro, perfilSolicitante: Perfil) => {
    //PROFESSOR só pode ser cadastrado por ADMIN
    if (dados.perfil === 'PROFESSOR' && perfilSolicitante !== 'ADMIN') {
      throw new Error('Apenas administradores podem cadastrar professores')
    }
    //ADMIN e NAPA só podem ser cadastrados por ADMIN
    if ((dados.perfil === 'ADMIN' || dados.perfil === 'NAPA') && perfilSolicitante !== 'ADMIN') {
      throw new Error('Apenas administradores podem cadastrar este perfil')
    }
    //email duplicado
    const emailExistente = await UsuarioRepository.buscarPorEmail(dados.email)
    if (emailExistente) throw new Error('Email já cadastrado')
    //CPF duplicado (se informado)
    if (dados.cpf) {
      const cpfExistente = await UsuarioRepository.buscarPorCpf(dados.cpf)
      if (cpfExistente) throw new Error('CPF já cadastrado')
    }
    //Valida campos obrigatórios por perfil
    validarCamposPorPerfil(dados)
    const senhaHash = await AuthService.hashSenha(dados.senha)
    return UsuarioRepository.salvar({ ...dados, senha: senhaHash })
  },
  buscarPorId: async (id: number) => {
    const usuario = await UsuarioRepository.buscarPorId(id)
    if (!usuario) throw new Error('Usuário não encontrado')
    return usuario
  }
}

//Valida se os campos obrigatórios do perfil foram enviados
function validarCamposPorPerfil(dados: DadosCadastro) {
  if (dados.perfil === 'ESTUDANTE') {
    if (!dados.tipoEstagio)
      throw new Error('Campo obrigatório para ESTUDANTE: tipoEstagio (CURRICULAR | EXTRACURRICULAR)')
    if (!dados.nomeCurso)
      throw new Error('Campo obrigatório para ESTUDANTE: nomeCurso')
    if (!dados.nomeSupervisor)
      throw new Error('Campo obrigatório para ESTUDANTE: nomeSupervisor')
    if (dados.periodoAtual == null)
      throw new Error('Campo obrigatório para ESTUDANTE: periodoAtual')
    if (!dados.previsaoConclusao)
      throw new Error('Campo obrigatório para ESTUDANTE: previsaoConclusao')
  }
  if (dados.perfil === 'PROFESSOR') {
    if (!dados.conselhoProfissional)
      throw new Error('Campo obrigatório para PROFESSOR: conselhoProfissional (ex: CRO, CRM)')
    if (!dados.numeroRegistro)
      throw new Error('Campo obrigatório para PROFESSOR: numeroRegistro')
    if (!dados.estadoRegistro)
      throw new Error('Campo obrigatório para PROFESSOR: estadoRegistro (UF com 2 letras)')
    if (!dados.dataValidade)
      throw new Error('Campo obrigatório para PROFESSOR: dataValidade')
  }
}