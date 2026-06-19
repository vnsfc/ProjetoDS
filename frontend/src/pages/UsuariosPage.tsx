import React, { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { Alert, Button, Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useUsuarios, Usuario } from '@/hooks/useUsuarios';
import { UsuariosTable } from '@/components/usuarios/UsuariosTable';
import axiosInstance from '@/api/axiosInstance';

type PerfilFiltro = 'TODOS' | 'ESTUDANTE' | 'PROFESSOR' | 'NAPA' | 'ADMIN';

const estadoInicialFormulario = {
  nome: '', 
  email: '', 
  senha: '', 
  perfil: 'ESTUDANTE',
  // Campos de Estudante
  tipoEstagio: '', 
  nomeCurso: '', 
  nomeSupervisor: '', 
  periodoAtual: '', 
  previsaoConclusao: '',
  // Campos de Professor
  conselhoProfissional: '', 
  numeroRegistro: '', 
  estadoRegistro: '', 
  dataValidade: ''
};

export const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const { usuarios, loading, error, refetch } = useUsuarios();

  // Estados para os Modais e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | null>(null);
  const [usuarioParaInativar, setUsuarioParaInativar] = useState<string | number | null>(null);
  
  const [formData, setFormData] = useState(estadoInicialFormulario);
  const [busca, setBusca] = useState('');
  const [perfilFiltro, setPerfilFiltro] = useState<PerfilFiltro>('TODOS');

  // Filtro
  const usuariosFiltrados = usuarios.filter((u) => {
    const buscaOk = u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase());
    const perfilOk = perfilFiltro === 'TODOS' || u.perfil === perfilFiltro;
    return buscaOk && perfilOk;
  });

  const perfilOpcoes: { valor: PerfilFiltro; label: string }[] = [
    { valor: 'TODOS', label: 'Todos' },
    { valor: 'ESTUDANTE', label: 'Estudantes' },
    { valor: 'PROFESSOR', label: 'Professores' },
    { valor: 'NAPA', label: 'NAPA' },
    { valor: 'ADMIN', label: 'Administradores' },
  ];

  // ── FUNÇÕES DE AÇÃO ──────────────────────────────────────────────

  const abrirModalNovo = () => {
    setUsuarioEmEdicao(null);
    setFormData(estadoInicialFormulario);
    setIsModalOpen(true);
  };

  const abrirModalEdicao = async (usuario: Usuario) => {
    try {
      // Faz a requisição para buscar todos os detalhes do usuário específico
      const response = await axiosInstance.get(`/usuarios/${usuario.id}`);
      const dadosCompletos = response.data;

      setUsuarioEmEdicao(usuario);
      
      // Mescla o estado inicial com os dados vindos do banco
      setFormData({ 
        ...estadoInicialFormulario, 
        ...dadosCompletos,
        senha: '', // Mantemos a senha vazia por segurança
      });
      
      setIsModalOpen(true);
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao carregar os dados completos do usuário.');
    }
  };

  const confirmarInativacao = (id: string | number) => {
    setUsuarioParaInativar(id);
  };

  const handleInativar = async () => {
    if (!usuarioParaInativar) return;

    try {
      // Faz a requisição para o backend
      await axiosInstance.delete(`/usuarios/${usuarioParaInativar}`);
      
      alert('Usuário inativado com sucesso!');
      refetch(); // Recarrega a tabela automaticamente
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao inativar usuário.');
    } finally {
      setUsuarioParaInativar(null);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepara os dados convertendo tipos onde necessário
      const payload = { ...formData };
      if (payload.perfil === 'ESTUDANTE' && payload.periodoAtual) {
        (payload as any).periodoAtual = Number(payload.periodoAtual);
      }

      if (usuarioEmEdicao) {
        // Faz a requisição real de edição para o backend
        await axiosInstance.put(`/usuarios/${usuarioEmEdicao.id}`, payload);
        alert('Usuário atualizado com sucesso!');
      } else {
        // Faz a requisição real de criação para o backend
        await axiosInstance.post('/usuarios/cadastro', payload);
        alert('Usuário cadastrado com sucesso!');
      }
      
      refetch(); // Recarrega a tabela para mostrar os dados novos
      setIsModalOpen(false); // Fecha o modal
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao salvar usuário. Verifique os campos.');
    }
  };

  return (
    <div>
      <PageHeader
        titulo="Gerenciamento de Usuários"
        descricao="Administre os acessos e perfis do sistema."
        acao={
          user?.perfil === 'ADMIN' ? (
            <Button type="button" onClick={abrirModalNovo}>
              Novo Usuário
            </Button>
          ) : null
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-6">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 flex-wrap">
          {perfilOpcoes.map((opcao) => (
            <button
              key={opcao.valor}
              onClick={() => setPerfilFiltro(opcao.valor)}
              className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                perfilFiltro === opcao.valor ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <UsuariosTable 
              usuarios={usuariosFiltrados} 
              onEdit={abrirModalEdicao} 
              onInativar={confirmarInativacao} 
            />
          )}
        </div>
      )}

      {/* ── JANELA MODAL DE CRIAÇÃO/EDIÇÃO ────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-medium text-gray-900">
                {usuarioEmEdicao ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="usuarioForm" onSubmit={handleSalvar} className="flex flex-col gap-4">
                {/* ── DADOS BÁSICOS ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input 
                      type="text" required 
                      value={formData.nome} 
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input 
                      type="email" required 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>

                  {!usuarioEmEdicao && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                      <input 
                        type="password" required 
                        value={formData.senha} 
                        onChange={(e) => setFormData({...formData, senha: e.target.value})}
                        placeholder="Digite a senha"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                    <select 
                      value={formData.perfil} 
                      onChange={(e) => setFormData({...formData, perfil: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ESTUDANTE">Estudante</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="NAPA">NAPA</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>

                {/* ── CAMPOS ESPECÍFICOS DE ESTUDANTE ── */}
                {formData.perfil === 'ESTUDANTE' && (
                  <div className="mt-2 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Dados Acadêmicos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                        <input 
                          type="text" required 
                          value={formData.nomeCurso} 
                          onChange={(e) => setFormData({...formData, nomeCurso: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período Atual</label>
                        <input 
                          type="number" required min="1"
                          value={formData.periodoAtual} 
                          onChange={(e) => setFormData({...formData, periodoAtual: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Estágio</label>
                        <input 
                          type="text" required 
                          value={formData.tipoEstagio} 
                          onChange={(e) => setFormData({...formData, tipoEstagio: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Supervisor</label>
                        <input 
                          type="text" required 
                          value={formData.nomeSupervisor} 
                          onChange={(e) => setFormData({...formData, nomeSupervisor: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Conclusão</label>
                        <input 
                          type="date" required 
                          value={formData.previsaoConclusao} 
                          onChange={(e) => setFormData({...formData, previsaoConclusao: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CAMPOS ESPECÍFICOS DE PROFESSOR ── */}
                {formData.perfil === 'PROFESSOR' && (
                  <div className="mt-2 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Dados Profissionais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conselho Profissional</label>
                        <input 
                          type="text" required placeholder="Ex: CRM, CRP, COREN"
                          value={formData.conselhoProfissional} 
                          onChange={(e) => setFormData({...formData, conselhoProfissional: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Registro</label>
                        <input 
                          type="text" required 
                          value={formData.numeroRegistro} 
                          onChange={(e) => setFormData({...formData, numeroRegistro: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado do Registro (UF)</label>
                        <input 
                          type="text" required maxLength={2} placeholder="Ex: PE"
                          value={formData.estadoRegistro} 
                          onChange={(e) => setFormData({...formData, estadoRegistro: e.target.value.toUpperCase()})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                        <input 
                          type="date" required 
                          value={formData.dataValidade} 
                          onChange={(e) => setFormData({...formData, dataValidade: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* ── BOTÕES DE AÇÃO DO MODAL ── */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="usuarioForm"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── JANELA MODAL DE CONFIRMAÇÃO DE INATIVAÇÃO ────────────────────────── */}
      {usuarioParaInativar !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Você tem certeza disso?</h3>
            <p className="text-sm text-gray-500 mb-6">Esta ação inativará o acesso do usuário no sistema.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setUsuarioParaInativar(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleInativar}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                Inativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};