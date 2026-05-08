import React, { useEffect, useState } from 'react';
import { listarOfertas, criarOferta, Oferta, CriarOfertaDTO } from '../../api/ofertaApi';
import { useAuthStore } from '../../stores/AuthStores';

const GestaoOfertasPage: React.FC = () => {
  const { user } = useAuthStore();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<CriarOfertaDTO>({
    titulo: '',
    descricao: '',
    vagasDisponiveis: 1,
  });

  const podeCrear = user?.perfil === 'NAPA' || user?.perfil === 'ADMIN';

  useEffect(() => {
    carregarOfertas();
  }, []);

  const carregarOfertas = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await listarOfertas();
      setOfertas(dados);
    } catch (e) {
      setErro('Erro ao carregar ofertas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.descricao.trim()) return;
    try {
      setSalvando(true);
      const nova = await criarOferta(form);
      setOfertas((prev) => [nova, ...prev]);
      setForm({ titulo: '', descricao: '', vagasDisponiveis: 1 });
      setMostrarForm(false);
    } catch (e) {
      setErro('Erro ao criar oferta. Verifique os dados e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Ofertas</h1>
          <p className="text-gray-500 mt-1">
            {ofertas.length} oferta{ofertas.length !== 1 ? 's' : ''} disponível{ofertas.length !== 1 ? 'is' : ''}
          </p>
        </div>
        {podeCrear && (
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {mostrarForm ? 'Cancelar' : '+ Nova Oferta'}
          </button>
        )}
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {/* Formulário de criação */}
      {mostrarForm && podeCrear && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Nova Oferta</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Atendimento psicológico"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descreva a oferta..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Vagas disponíveis</label>
            <input
              type="number"
              value={form.vagasDisponiveis}
              onChange={(e) => setForm({ ...form, vagasDisponiveis: Number(e.target.value) })}
              min={1}
              required
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={salvando}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              {salvando ? 'Salvando...' : 'Criar Oferta'}
            </button>
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de ofertas */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : ofertas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nenhuma oferta cadastrada ainda.</p>
          {podeCrear && (
            <p className="text-sm mt-1">Clique em "Nova Oferta" para começar.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {ofertas.map((oferta) => (
            <div
              key={oferta.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{oferta.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1">{oferta.descricao}</p>
                </div>
                <span className="ml-4 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                  {oferta.vagasDisponiveis} vaga{oferta.vagasDisponiveis !== 1 ? 's' : ''}
                </span>
              </div>
              {oferta.createdAt && (
                <p className="text-xs text-gray-400 mt-3">
                  Criado em {new Date(oferta.createdAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestaoOfertasPage;