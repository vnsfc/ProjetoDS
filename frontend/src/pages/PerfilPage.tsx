import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, Button, Input, Select, Badge, Spinner, toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { perfilLabel } from '@/utils'
import axiosInstance from '@/api/axiosInstance'
import type { UserPerfil } from '@/types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PerfilCompleto {
  id: number
  nome: string
  email: string
  perfil: UserPerfil
  nacionalidade?: string | null
  cpf?: string | null
  telefone?: string | null
  dataNascimento?: string | null
  clinicaAtuacao?: string | null
  // ESTUDANTE
  tipoEstagio?: string | null
  nomeSupervisor?: string | null
  nomeCurso?: string | null
  periodoAtual?: number | null
  previsaoConclusao?: string | null
  // PROFESSOR
  conselhoProfissional?: string | null
  numeroRegistro?: string | null
  estadoRegistro?: string | null
  dataValidade?: string | null
}

// Formata ISO date para input[type=date] (YYYY-MM-DD)
const toDateInput = (iso?: string | null) => {
  if (!iso) return ''
  return iso.split('T')[0]
}

// Badge por perfil
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'
const perfilVariant = (p: UserPerfil): BadgeVariant => {
  if (p === 'ADMIN') return 'danger'
  if (p === 'PROFESSOR') return 'info'
  if (p === 'NAPA') return 'warning'
  return 'default'
}

// ─── Sub-componente: Dados Pessoais ──────────────────────────────────────────

interface DadosPessoaisProps {
  dados: PerfilCompleto
  onSaved: (atualizado: PerfilCompleto) => void
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({ dados, onSaved }) => {
  const [form, setForm] = useState({
    nome: dados.nome ?? '',
    telefone: dados.telefone ?? '',
    nacionalidade: dados.nacionalidade ?? '',
    cpf: dados.cpf ?? '',
    dataNascimento: toDateInput(dados.dataNascimento),
    clinicaAtuacao: dados.clinicaAtuacao ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) { toast('error', 'Nome e obrigatorio'); return }
    setSaving(true)
    try {
      const payload: Record<string, any> = {
        nome: form.nome.trim(),
        telefone: form.telefone || null,
        nacionalidade: form.nacionalidade || null,
        cpf: form.cpf || null,
        dataNascimento: form.dataNascimento || null,
        clinicaAtuacao: form.clinicaAtuacao || null,
      }
      const { data } = await axiosInstance.put('/usuarios/me', payload)
      onSaved(data)
      toast('success', 'Dados atualizados com sucesso')
    } catch (err: any) {
      toast('error', err.response?.data?.erro ?? 'Erro ao salvar dados')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Dados Pessoais</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome completo" value={form.nome} onChange={set('nome')} required />
          <Input label="Telefone" value={form.telefone} onChange={set('telefone')} placeholder="+5581999999999" />
          <Input label="Nacionalidade" value={form.nacionalidade} onChange={set('nacionalidade')} placeholder="Brasileira" />
          <Input label="CPF" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
          <Input label="Data de nascimento" type="date" value={form.dataNascimento} onChange={set('dataNascimento')} />
          <Input label="Clinica de atuacao" value={form.clinicaAtuacao} onChange={set('clinicaAtuacao')} placeholder="Ex: Clinica de Dentistica" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving}>Salvar dados</Button>
        </div>
      </form>
    </Card>
  )
}

// ─── Sub-componente: Campos ESTUDANTE ────────────────────────────────────────

const CamposEstudante: React.FC<{ dados: PerfilCompleto; onSaved: (d: PerfilCompleto) => void }> = ({ dados, onSaved }) => {
  const [form, setForm] = useState({
    tipoEstagio: dados.tipoEstagio ?? '',
    nomeSupervisor: dados.nomeSupervisor ?? '',
    nomeCurso: dados.nomeCurso ?? '',
    periodoAtual: dados.periodoAtual?.toString() ?? '',
    previsaoConclusao: toDateInput(dados.previsaoConclusao),
  })
  const [saving, setSaving] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        tipoEstagio: form.tipoEstagio || null,
        nomeSupervisor: form.nomeSupervisor || null,
        nomeCurso: form.nomeCurso || null,
        periodoAtual: form.periodoAtual ? Number(form.periodoAtual) : null,
        previsaoConclusao: form.previsaoConclusao || null,
      }
      const { data } = await axiosInstance.put('/usuarios/me', payload)
      onSaved(data)
      toast('success', 'Informacoes de estagio atualizadas')
    } catch (err: any) {
      toast('error', err.response?.data?.erro ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Informacoes de Estagio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Tipo de estagio"
            value={form.tipoEstagio}
            onChange={e => setForm(prev => ({ ...prev, tipoEstagio: e.target.value }))}
            options={[
              { value: 'CURRICULAR', label: 'Curricular' },
              { value: 'EXTRACURRICULAR', label: 'Extracurricular' },
            ]}
            placeholder="Selecione..."
          />
          <Input label="Nome do supervisor" value={form.nomeSupervisor} onChange={set('nomeSupervisor')} />
          <Input label="Curso" value={form.nomeCurso} onChange={set('nomeCurso')} placeholder="Ex: Odontologia" />
          <Input label="Periodo atual" type="number" min="1" max="12" value={form.periodoAtual} onChange={set('periodoAtual')} />
          <Input label="Previsao de conclusao" type="date" value={form.previsaoConclusao} onChange={set('previsaoConclusao')} />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving}>Salvar estagio</Button>
        </div>
      </form>
    </Card>
  )
}

// ─── Sub-componente: Campos PROFESSOR ────────────────────────────────────────

const CamposProfessor: React.FC<{ dados: PerfilCompleto; onSaved: (d: PerfilCompleto) => void }> = ({ dados, onSaved }) => {
  const [form, setForm] = useState({
    conselhoProfissional: dados.conselhoProfissional ?? '',
    numeroRegistro: dados.numeroRegistro ?? '',
    estadoRegistro: dados.estadoRegistro ?? '',
    dataValidade: toDateInput(dados.dataValidade),
  })
  const [saving, setSaving] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        conselhoProfissional: form.conselhoProfissional || null,
        numeroRegistro: form.numeroRegistro || null,
        estadoRegistro: form.estadoRegistro || null,
        dataValidade: form.dataValidade || null,
      }
      const { data } = await axiosInstance.put('/usuarios/me', payload)
      onSaved(data)
      toast('success', 'Registro profissional atualizado')
    } catch (err: any) {
      toast('error', err.response?.data?.erro ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Registro Profissional</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Conselho profissional" value={form.conselhoProfissional} onChange={set('conselhoProfissional')} placeholder="Ex: CRO, CRM" />
          <Input label="Numero de registro" value={form.numeroRegistro} onChange={set('numeroRegistro')} />
          <Input label="Estado (UF)" value={form.estadoRegistro} onChange={set('estadoRegistro')} placeholder="Ex: PE" maxLength={2} />
          <Input label="Data de validade" type="date" value={form.dataValidade} onChange={set('dataValidade')} />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving}>Salvar registro</Button>
        </div>
      </form>
    </Card>
  )
}

// ─── Sub-componente: Alterar Senha ───────────────────────────────────────────

const AlterarSenha: React.FC = () => {
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [saving, setSaving] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.novaSenha.length < 6) { toast('error', 'A nova senha deve ter pelo menos 6 caracteres'); return }
    if (form.novaSenha !== form.confirmar) { toast('error', 'As senhas nao coincidem'); return }
    setSaving(true)
    try {
      await axiosInstance.put('/usuarios/me', {
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
      })
      setForm({ senhaAtual: '', novaSenha: '', confirmar: '' })
      toast('success', 'Senha alterada com sucesso')
    } catch (err: any) {
      toast('error', err.response?.data?.erro ?? 'Erro ao alterar senha')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Alterar Senha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Senha atual" type="password" value={form.senhaAtual} onChange={set('senhaAtual')} required autoComplete="current-password" />
          <Input label="Nova senha" type="password" value={form.novaSenha} onChange={set('novaSenha')} required autoComplete="new-password" helperText="Minimo 6 caracteres" />
          <Input label="Confirmar nova senha" type="password" value={form.confirmar} onChange={set('confirmar')} required autoComplete="new-password" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="secondary" loading={saving}>Alterar senha</Button>
        </div>
      </form>
    </Card>
  )
}

// ─── Pagina principal ────────────────────────────────────────────────────────

export const PerfilPage: React.FC = () => {
  const { user } = useAuth()
  const [dados, setDados] = useState<PerfilCompleto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance
      .get<PerfilCompleto>('/usuarios/me')
      .then(r => setDados(r.data))
      .catch(() => toast('error', 'Erro ao carregar perfil'))
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  return (
    <div>
      <PageHeader titulo="Meu Perfil" descricao="Visualize e edite suas informacoes pessoais." />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : !dados ? (
        <Card>
          <p className="text-sm text-gray-500 text-center py-8">Nao foi possivel carregar os dados do perfil.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header do perfil — info nao editavel */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">
                  {dados.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{dados.nome}</p>
                <p className="text-sm text-gray-500">{dados.email}</p>
                <div className="mt-1">
                  <Badge variant={perfilVariant(dados.perfil)}>{perfilLabel(dados.perfil)}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Dados pessoais */}
          <DadosPessoais dados={dados} onSaved={setDados} />

          {/* Campos especificos por perfil */}
          {dados.perfil === 'ESTUDANTE' && (
            <CamposEstudante dados={dados} onSaved={setDados} />
          )}
          {dados.perfil === 'PROFESSOR' && (
            <CamposProfessor dados={dados} onSaved={setDados} />
          )}

          {/* Alterar senha */}
          <AlterarSenha />
        </div>
      )}
    </div>
  )
}
