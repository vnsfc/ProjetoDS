import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('../repositories/UsuarioRepository', () => ({
  UsuarioRepository: {
    buscarPorEmail: vi.fn(),
    salvar: vi.fn(),
    buscarPorId: vi.fn(),
  }
}))

vi.mock('../repositories/ProntuarioRepository', () => ({
  ProntuarioRepository: {
    salvar: vi.fn(),
    buscarPorId: vi.fn(),
    listarPorAluno: vi.fn(),
    atualizar: vi.fn(),
  }
}))

vi.mock('../repositories/FilaEsperaRepository', () => ({
  FilaEsperaRepository: {
    buscarFila: vi.fn(),
    adicionar: vi.fn(),
    remover: vi.fn(),
  }
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hash_da_senha'),
    compare: vi.fn(),
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('token_fake'),
    verify: vi.fn(),
  }
}))

// ─── Imports após mocks ───────────────────────────────────────────────────────

import { UsuarioRepository } from '../repositories/UsuarioRepository'
import { ProntuarioRepository } from '../repositories/ProntuarioRepository'
import { FilaEsperaRepository } from '../repositories/FilaEsperaRepository'
import { AuthService } from '../services/AuthService'
import { UsuarioService } from '../services/UsuarioService'
import { ProntuarioService } from '../services/ProntuarioService'
import { FilaEsperaService } from '../services/FilaEsperaService'
import bcrypt from 'bcrypt'

// Reseta todos os mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {

  it('Teste 1 - hashSenha: deve gerar um hash para a senha', async () => {
    const hash = await AuthService.hashSenha('123456')
    expect(hash).toBe('hash_da_senha')
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10)
  })

  it('Teste 2 - login: deve retornar token e dados do usuário ao logar com sucesso', async () => {
    const usuarioMock = { id: 1, nome: 'Davis', email: 'davis@email.com', senha: 'hash', perfil: 'ESTUDANTE' }
    vi.mocked(UsuarioRepository.buscarPorEmail).mockResolvedValue(usuarioMock as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const resultado = await AuthService.login('davis@email.com', '123456')

    expect(resultado.token).toBe('token_fake')
    expect(resultado.usuario.nome).toBe('Davis')
    expect(resultado.usuario.perfil).toBe('ESTUDANTE')
  })

  it('Teste 3 - login: deve lançar erro se usuário não existir', async () => {
    vi.mocked(UsuarioRepository.buscarPorEmail).mockResolvedValue(null)

    await expect(AuthService.login('naoexiste@email.com', '123456'))
      .rejects.toThrow('Usuário e/ou senha incorretos')
  })

  it('Teste 4 - login: deve lançar erro se senha estiver incorreta', async () => {
    const usuarioMock = { id: 1, nome: 'Davis', email: 'davis@email.com', senha: 'hash', perfil: 'ESTUDANTE' }
    vi.mocked(UsuarioRepository.buscarPorEmail).mockResolvedValue(usuarioMock as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(AuthService.login('davis@email.com', 'senhaerrada'))
      .rejects.toThrow('Usuário e/ou senha incorretos')
  })

})

describe('UsuarioService', () => {

  it('Teste 5 - cadastrar: deve cadastrar um ESTUDANTE sem restrições', async () => {
    vi.mocked(UsuarioRepository.buscarPorEmail).mockResolvedValue(null)
    const usuarioMock = { id: 1, nome: 'Ana', email: 'ana@email.com', perfil: 'ESTUDANTE' }
    vi.mocked(UsuarioRepository.salvar).mockResolvedValue(usuarioMock as any)

    const resultado = await UsuarioService.cadastrar(
      { nome: 'Ana', email: 'ana@email.com', senha: '123456', perfil: 'ESTUDANTE' },
      'ESTUDANTE'
    )

    expect(resultado.nome).toBe('Ana')
    expect(resultado.perfil).toBe('ESTUDANTE')
  })

  it('Teste 6 - cadastrar: ESTUDANTE não pode cadastrar PROFESSOR', async () => {
    await expect(
      UsuarioService.cadastrar(
        { nome: 'Prof', email: 'prof@email.com', senha: '123456', perfil: 'PROFESSOR' },
        'ESTUDANTE'
      )
    ).rejects.toThrow('Apenas administradores podem cadastrar professores')
  })

  it('Teste 7 - cadastrar: ADMIN pode cadastrar PROFESSOR', async () => {
    vi.mocked(UsuarioRepository.buscarPorEmail).mockResolvedValue(null)
    const professorMock = { id: 2, nome: 'Prof Silva', email: 'prof@email.com', perfil: 'PROFESSOR' }
    vi.mocked(UsuarioRepository.salvar).mockResolvedValue(professorMock as any)

    const resultado = await UsuarioService.cadastrar(
      { nome: 'Prof Silva', email: 'prof@email.com', senha: '123456', perfil: 'PROFESSOR' },
      'ADMIN'
    )

    expect(resultado.perfil).toBe('PROFESSOR')
  })

})

describe('ProntuarioService', () => {

  it('Teste 8 - criar: deve criar um prontuário corretamente', async () => {
    const prontuarioMock = { id: 1, pacienteNome: 'João', anamnese: 'Queixa X', procedimentos: 'Proc Y', assinado: false, estudanteId: 1 }
    vi.mocked(ProntuarioRepository.salvar).mockResolvedValue(prontuarioMock as any)

    const resultado = await ProntuarioService.criar({
      pacienteNome: 'João',
      anamnese: 'Queixa X',
      procedimentos: 'Proc Y',
      estudanteId: 1
    })

    expect(resultado.pacienteNome).toBe('João')
    expect(resultado.assinado).toBe(false)
  })

  it('Teste 9 - listarPorAluno: deve retornar lista de prontuários do estudante', async () => {
    const lista = [
      { id: 1, pacienteNome: 'João', assinado: false, estudanteId: 1 },
      { id: 2, pacienteNome: 'Maria', assinado: true, estudanteId: 1 },
    ]
    vi.mocked(ProntuarioRepository.listarPorAluno).mockResolvedValue(lista as any)

    const resultado = await ProntuarioService.listarPorAluno(1)

    expect(resultado).toHaveLength(2)
    expect(resultado[0].pacienteNome).toBe('João')
  })

})

describe('FilaEsperaService', () => {

  it('Teste 10 - listarOrdenada: deve ordenar por prioridade URGENTE > NORMAL > ELETIVO', async () => {
    const filaDesordenada = [
      { id: 1, pacienteNome: 'Carlos', prioridade: 'ELETIVO' },
      { id: 2, pacienteNome: 'Ana', prioridade: 'URGENTE' },
      { id: 3, pacienteNome: 'Pedro', prioridade: 'NORMAL' },
    ]
    vi.mocked(FilaEsperaRepository.buscarFila).mockResolvedValue(filaDesordenada as any)

    const resultado = await FilaEsperaService.listarOrdenada()

    expect(resultado[0].prioridade).toBe('URGENTE')
    expect(resultado[1].prioridade).toBe('NORMAL')
    expect(resultado[2].prioridade).toBe('ELETIVO')
  })

})
