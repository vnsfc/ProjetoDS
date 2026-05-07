import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout';
import { Alert, Button, Spinner } from '@/components/ui';
import { ProntuarioList } from '@/components/prontuarios';
import { useAuth } from '@/hooks/useAuth';
import { useProntuarios } from '@/hooks/useProntuarios';

export const ProntuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { prontuarios, loading, error } = useProntuarios();

  return (
    <div>
      <PageHeader
        titulo="Prontuários"
        descricao="Consulte os registros clínicos e acompanhe as assinaturas."
        acao={
          user?.perfil === 'ESTUDANTE' ? (
            <Button type="button" onClick={() => navigate('/prontuarios/novo')}>
              Novo prontuário
            </Button>
          ) : null
        }
      />

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && <ProntuarioList prontuarios={prontuarios} />}
    </div>
  );
};
