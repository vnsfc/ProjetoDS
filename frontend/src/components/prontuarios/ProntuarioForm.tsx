import React, { useState } from 'react';
import { Button, Card, Input } from '@/components/ui';
import type { CriarProntuarioDTO, EditarProntuarioDTO, Prontuario } from '@/types';

interface ProntuarioFormProps {
  prontuario?: Prontuario;
  loading?: boolean;
  onSubmit: (dados: CriarProntuarioDTO | EditarProntuarioDTO) => Promise<void>;
}

export const ProntuarioForm: React.FC<ProntuarioFormProps> = ({
  prontuario,
  loading = false,
  onSubmit,
}) => {
  const [pacienteNome, setPacienteNome] = useState(prontuario?.pacienteNome ?? '');
  const [evolucaoClinica, setEvolucaoClinica] = useState(prontuario?.evolucaoClinica ?? '');
  const [procedimentos, setProcedimentos] = useState(prontuario?.procedimentos ?? '');

  const isEdicao = Boolean(prontuario);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Na edição o backend só aceita evolucaoClinica e procedimentos.
    const dados = isEdicao
      ? { evolucaoClinica, procedimentos }
      : { pacienteNome, evolucaoClinica, procedimentos };

    await onSubmit(dados);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome do paciente"
          value={pacienteNome}
          onChange={(event) => setPacienteNome(event.target.value)}
          disabled={isEdicao}
          required
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="evolucaoClinica" className="text-sm font-medium text-gray-700">
            Evolução Clínica / Anamnese
          </label>
          <textarea
            id="evolucaoClinica"
            value={evolucaoClinica}
            onChange={(event) => setEvolucaoClinica(event.target.value)}
            className="min-h-32 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva a queixa, histórico e observações do atendimento."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="procedimentos" className="text-sm font-medium text-gray-700">
            Procedimentos
          </label>
          <textarea
            id="procedimentos"
            value={procedimentos}
            onChange={(event) => setProcedimentos(event.target.value)}
            className="min-h-32 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Informe os procedimentos realizados ou planejados."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            {isEdicao ? 'Salvar alterações' : 'Criar prontuário'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
