import React from 'react';
import { Badge, Button, Card } from '@/components/ui';
import type { Prontuario } from '@/types';
import { formatDateTime } from '@/utils';

interface AssinaturaSectionProps {
  prontuario: Prontuario;
  podeAssinar: boolean;
  loading?: boolean;
  onAssinar: () => Promise<void>;
}

export const AssinaturaSection: React.FC<AssinaturaSectionProps> = ({
  prontuario,
  podeAssinar,
  loading = false,
  onAssinar,
}) => {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Assinatura</h2>
            <Badge variant={prontuario.status === 'ASSINADO' ? 'success' : 'warning'}>
              {prontuario.status === 'ASSINADO' ? 'Assinado' : 'Aguardando professor'}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Última atualização em {formatDateTime(prontuario.updatedAt)}.
          </p>
        </div>

        {podeAssinar && prontuario.status !== 'ASSINADO' && (
          <Button type="button" loading={loading} onClick={() => void onAssinar()}>
            Assinar prontuário
          </Button>
        )}
      </div>
    </Card>
  );
};
