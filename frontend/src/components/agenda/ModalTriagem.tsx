import React, { useState } from 'react';
import { criarTriagem } from '@/api/agenda.api';

export const ModalNovaTriagem = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [pacienteNome, setPacienteNome] = useState('');
  const [prioridade, setPrioridade] = useState('NORMAL');
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await criarTriagem({ pacienteNome, prioridade, motivo, observacoes });
      onSave();
      onClose();
    } catch (error) {
      alert("Erro ao salvar a triagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-[500px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Nova Triagem de Paciente</h2>
        
        <input className="w-full border p-2 mb-3 rounded" placeholder="Nome do Paciente" value={pacienteNome} onChange={e => setPacienteNome(e.target.value)} required />
        
        <select className="w-full border p-2 mb-3 rounded" value={prioridade} onChange={e => setPrioridade(e.target.value)} required>
          <option value="NORMAL">Normal</option>
          <option value="ELETIVO">Eletivo</option>
          <option value="URGENTE">Urgente</option>
        </select>

        <textarea className="w-full border p-2 mb-3 rounded h-24" placeholder="Motivo da Consulta principal..." value={motivo} onChange={e => setMotivo(e.target.value)} required />
        <textarea className="w-full border p-2 mb-4 rounded h-20" placeholder="Observações adicionais (Opcional)" value={observacoes} onChange={e => setObservacoes(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? 'Salvando...' : 'Cadastrar na Fila'}
          </button>
        </div>
      </form>
    </div>
  );
};