import React, { useState, useEffect } from 'react';
import api from '@/api/axiosInstance'; // Assumindo seu setup de axios

export const ModalAgendamento = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [pacienteNome, setPacienteNome] = useState('');
  const [data, setData] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState('');

  useEffect(() => {
    api.get('/usuarios')
        .then((res: { data: any[] }) => { // Adicionando tipagem aqui
        setUsuarios(res.data.filter((u: any) => u.perfil !== 'ADMIN'));
        })
        .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/agenda', { data, pacienteNome, usuarioId });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
        <input className="w-full border p-2 mb-2" placeholder="Nome do Paciente" onChange={e => setPacienteNome(e.target.value)} required />
        <input className="w-full border p-2 mb-2" type="datetime-local" onChange={e => setData(e.target.value)} required />
        
        {/* Apenas mostra seleção de usuário se não for estudante */}
        <select className="w-full border p-2 mb-4" onChange={e => setUsuarioId(e.target.value)}>
          <option value="">Selecione o responsável</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome} ({u.perfil})</option>)}
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Agendar</button>
        </div>
      </form>
    </div>
  );
};