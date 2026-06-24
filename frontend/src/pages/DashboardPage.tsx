import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Spinner } from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { formatDate } from '@/utils';
import { perfilLabel } from '@/utils';
import axiosInstance from '@/api/axiosInstance';
import type { UserPerfil } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos locais — espelham exatamente o schema do backend (prisma/schema.prisma)
// Mantidos aqui para não modificar outros arquivos do projeto.
// ─────────────────────────────────────────────────────────────────────────────

interface ProntuarioDash {
  id: number;
  pacienteNome: string;
  status: 'EM_ANDAMENTO' | 'ASSINADO' | 'ARQUIVADO';
  createdAt: string;
  estudanteId: number;
  professorId?: number | null;
}

interface FilaDash {
  id: number;
  pacienteNome: string; // campo real do backend (FilaEspera.pacienteNome)
  prioridade: 'URGENTE' | 'NORMAL' | 'ELETIVO';
  createdAt: string;
}

interface OfertaDash {
  id: number;
  data: string;
  vagas: number;
}

interface UsuarioDash {
  id: number;
  nome: string;
  email: string;
  perfil: UserPerfil;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook central de dados
// Cada perfil busca apenas o que tem permissão de acessar nas rotas do backend.
// Falhas individuais são ignoradas silenciosamente (seção ficará vazia).
// ─────────────────────────────────────────────────────────────────────────────

interface DashData {
  prontuarios: ProntuarioDash[];
  fila: FilaDash[];
  ofertas: OfertaDash[];
  usuarios: UsuarioDash[];
  loading: boolean;
}

const useDashboardData = (perfil: UserPerfil): DashData => {
  const [prontuarios, setProntuarios] = useState<ProntuarioDash[]>([]);
  const [fila, setFila]               = useState<FilaDash[]>([]);
  const [ofertas, setOfertas]         = useState<OfertaDash[]>([]);
  const [usuarios, setUsuarios]       = useState<UsuarioDash[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Uma única chamada por perfil — backend agrega os dados necessários
        const rota = `/dashboard/${perfil.toLowerCase()}`;
        const { data } = await axiosInstance.get(rota);

        if (data.prontuarios) setProntuarios(data.prontuarios);
        if (data.fila)        setFila(data.fila);
        if (data.ofertas)     setOfertas(data.ofertas);
        if (data.usuarios)    setUsuarios(data.usuarios);
      } catch {
        // mantém estados vazios em caso de erro
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [perfil]);

  return { prontuarios, fila, ofertas, usuarios, loading };
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários de cálculo
// ─────────────────────────────────────────────────────────────────────────────

/** Últimos N meses em formato abreviado pt-BR */
const getLast6Months = () => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', ''),
    };
  });
};

/** Conta itens por mês nos últimos 6 meses */
const countByMonth = (items: { createdAt: string }[]) => {
  const months = getLast6Months();
  const counts: Record<string, number> = {};
  months.forEach(m => (counts[m.key] = 0));
  items.forEach(item => {
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in counts) counts[key]++;
  });
  return months.map(m => ({ label: m.label, value: counts[m.key] }));
};

// ─────────────────────────────────────────────────────────────────────────────
// Mapeamentos de variante para Badge
// ─────────────────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const statusVariant = (status: string): BadgeVariant => {
  if (status === 'ASSINADO')  return 'success';
  if (status === 'ARQUIVADO') return 'default';
  return 'warning'; // EM_ANDAMENTO
};

const statusLabel = (status: string) => {
  if (status === 'ASSINADO')  return 'Assinado';
  if (status === 'ARQUIVADO') return 'Arquivado';
  return 'Em andamento';
};

const prioridadeVariant = (p: string): BadgeVariant => {
  if (p === 'URGENTE') return 'danger';
  if (p === 'NORMAL')  return 'warning';
  return 'success'; // ELETIVO — igual ao prioridadeConfig.ts existente
};

const prioridadeLabel = (p: string) => {
  if (p === 'URGENTE') return 'Urgente';
  if (p === 'NORMAL')  return 'Normal';
  return 'Eletivo';
};

const perfilBadgeVariant = (perfil: string): BadgeVariant => {
  if (perfil === 'ADMIN')     return 'danger';
  if (perfil === 'PROFESSOR') return 'info';
  if (perfil === 'NAPA')      return 'warning';
  return 'default'; // ESTUDANTE
};

// ─────────────────────────────────────────────────────────────────────────────
// Componentes de visualização reutilizáveis
// Todos usam Tailwind puro — sem libs externas.
// ─────────────────────────────────────────────────────────────────────────────

/** Card de KPI com label, valor grande e subtexto */
const KpiCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  valueClass?: string;
}> = ({ label, value, sub, valueClass = 'text-gray-900' }) => (
  <Card>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
      {label}
    </p>
    <p className={`text-3xl font-bold leading-none ${valueClass}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
  </Card>
);

/** Card de seção para gráficos/tabelas */
const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <Card className={className}>
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </Card>
);

// ── Gráfico Donut (SVG puro) ──────────────────────────────────────────────

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/**
 * Donut chart SVG sem dependências externas.
 *
 * Fórmula strokeDashoffset:
 *   pattern_pos = dashoffset + path_pos  (mod patternLength)
 *   Para iniciar em cumulative C: dashoffset = -C
 *   → primeiros C unidades do path estão na "folga" (invisível) ✓
 *   → posição C do path mapeia para pattern_pos 0 (início do traço) ✓
 */
const DonutChart: React.FC<{ segments: DonutSegment[]; size?: number }> = ({
  segments,
  size = 130,
}) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r             = 45;        // raio do traço
  const cx            = size / 2;
  const cy            = size / 2;
  const circumference = 2 * Math.PI * r; // ≈ 282.74

  let cumulative = 0;
  const arcs = segments.map(seg => {
    const dash = total > 0 ? (seg.value / total) * circumference : 0;
    const arc  = { ...seg, dash, offset: -cumulative };
    cumulative += dash;
    return arc;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Gráfico de distribuição"
    >
      {/* Anel de fundo */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth="14"
      />

      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
      ) : (
        arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth="14"
            strokeLinecap="butt"
            strokeDasharray={`${arc.dash} ${circumference}`}
            strokeDashoffset={arc.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))
      )}

      {/* Total no centro */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#111827"
        fontFamily="system-ui, sans-serif"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        fontSize="9"
        fill="#9ca3af"
        fontFamily="system-ui, sans-serif"
      >
        total
      </text>
    </svg>
  );
};

/** Donut + legenda lado a lado */
const DonutWithLegend: React.FC<{ segments: DonutSegment[] }> = ({ segments }) => (
  <div className="flex items-center gap-5">
    <DonutChart segments={segments} size={130} />
    <div className="space-y-2.5 flex-1">
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: seg.color }}
          />
          <span className="text-gray-600 flex-1 leading-tight">{seg.label}</span>
          <span className="font-semibold text-gray-800">{seg.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Barras horizontais (CSS) ──────────────────────────────────────────────

const BarList: React.FC<{
  items: { label: string; value: number; color: string }[];
}> = ({ items }) => {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Mini barras verticais por mês (CSS) ──────────────────────────────────

const MiniBarChart: React.FC<{
  data: { label: string; value: number }[];
  color?: string;
}> = ({ data, color = '#3b82f6' }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 72 }}>
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center justify-end gap-1"
          style={{ height: 72 }}
        >
          <div
            style={{
              width: '100%',
              height: d.value > 0
                ? `${Math.max((d.value / max) * 52, 4)}px`
                : '2px',
              backgroundColor: d.value > 0 ? color : '#e5e7eb',
              borderRadius: '2px 2px 0 0',
              transition: 'height 0.4s ease',
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-xs text-gray-400 text-center leading-none">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Células de tabela reutilizáveis ───────────────────────────────────────

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
    {children}
  </th>
);

const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

// ─────────────────────────────────────────────────────────────────────────────
// Seção ESTUDANTE
// Dados: GET /prontuarios  (backend retorna apenas os do estudante logado)
// ─────────────────────────────────────────────────────────────────────────────

const DashEstudante: React.FC<{ prontuarios: ProntuarioDash[] }> = ({ prontuarios }) => {
  const total       = prontuarios.length;
  const emAndamento = prontuarios.filter(p => p.status === 'EM_ANDAMENTO').length;
  const assinados   = prontuarios.filter(p => p.status === 'ASSINADO').length;
  const arquivados  = prontuarios.filter(p => p.status === 'ARQUIVADO').length;
  const taxaConcl   = total > 0 ? Math.round((assinados / total) * 100) : 0;

  const segStatus: DonutSegment[] = [
    { label: 'Em andamento', value: emAndamento, color: '#f59e0b' },
    { label: 'Assinados',    value: assinados,   color: '#22c55e' },
    { label: 'Arquivados',   value: arquivados,  color: '#9ca3af' },
  ];

  const meses = countByMonth(prontuarios);

  const recentes = [...prontuarios]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total de prontuários"
          value={total}
          sub="todos os registros"
        />
        <KpiCard
          label="Em andamento"
          value={emAndamento}
          sub="aguardando assinatura"
          valueClass="text-yellow-600"
        />
        <KpiCard
          label="Assinados"
          value={assinados}
          sub="prontuários concluídos"
          valueClass="text-green-600"
        />
        <KpiCard
          label="Taxa de conclusão"
          value={`${taxaConcl}%`}
          sub="assinados ÷ total"
          valueClass="text-blue-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Distribuição por status">
          {total === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhum prontuário criado ainda.
            </p>
          ) : (
            <DonutWithLegend segments={segStatus} />
          )}
        </SectionCard>

        <SectionCard title="Prontuários criados — últimos 6 meses">
          <MiniBarChart data={meses} color="#3b82f6" />
        </SectionCard>
      </div>

      {/* Tabela de recentes */}
      <SectionCard title="Prontuários recentes">
        {recentes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Nenhum prontuário criado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <TH>Paciente</TH>
                  <TH>Data</TH>
                  <TH>Status</TH>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentes.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <TD className="font-medium text-gray-900">{p.pacienteNome}</TD>
                    <TD>{formatDate(p.createdAt)}</TD>
                    <TD>
                      <Badge variant={statusVariant(p.status)}>
                        {statusLabel(p.status)}
                      </Badge>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Seção PROFESSOR
// Dados: GET /prontuarios (todos) + GET /fila
// ─────────────────────────────────────────────────────────────────────────────

const DashProfessor: React.FC<{
  prontuarios: ProntuarioDash[];
  fila: FilaDash[];
  userId: number;
}> = ({ prontuarios, fila, userId }) => {
  const emAndamento     = prontuarios.filter(p => p.status === 'EM_ANDAMENTO').length;
  const assinados       = prontuarios.filter(p => p.status === 'ASSINADO').length;
  const arquivados      = prontuarios.filter(p => p.status === 'ARQUIVADO').length;
  // Prontuários que este professor assinou (professorId === meu id)
  const assinadosPorMim = prontuarios.filter(
    p => p.status === 'ASSINADO' && p.professorId === userId,
  ).length;
  const urgentes = fila.filter(f => f.prioridade === 'URGENTE').length;

  const segStatus: DonutSegment[] = [
    { label: 'Em andamento', value: emAndamento, color: '#f59e0b' },
    { label: 'Assinados',    value: assinados,   color: '#22c55e' },
    { label: 'Arquivados',   value: arquivados,  color: '#9ca3af' },
  ];

  const barFila = [
    { label: 'Urgentes', value: fila.filter(f => f.prioridade === 'URGENTE').length, color: '#ef4444' },
    { label: 'Normais',  value: fila.filter(f => f.prioridade === 'NORMAL').length,  color: '#3b82f6' },
    { label: 'Eletivos', value: fila.filter(f => f.prioridade === 'ELETIVO').length, color: '#22c55e' },
  ];

  // Prontuários pendentes de assinatura — mais antigos primeiro (mais urgentes)
  const pendentes = [...prontuarios]
    .filter(p => p.status === 'EM_ANDAMENTO')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total de prontuários"
          value={prontuarios.length}
          sub="no sistema"
        />
        <KpiCard
          label="Aguardando assinatura"
          value={emAndamento}
          sub="em andamento"
          valueClass="text-yellow-600"
        />
        <KpiCard
          label="Assinados por mim"
          value={assinadosPorMim}
          sub="prontuários supervisionados"
          valueClass="text-green-600"
        />
        <KpiCard
          label="Pacientes na fila"
          value={fila.length}
          sub={urgentes > 0 ? `${urgentes} urgente${urgentes > 1 ? 's' : ''}` : 'sem urgentes'}
          valueClass={urgentes > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Status dos prontuários">
          {prontuarios.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sem dados.</p>
          ) : (
            <DonutWithLegend segments={segStatus} />
          )}
        </SectionCard>

        <SectionCard title="Fila de espera por prioridade">
          {fila.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Fila vazia.</p>
          ) : (
            <BarList items={barFila} />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Prontuários pendentes de assinatura (mais antigos primeiro)">
        {pendentes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Nenhum prontuário aguardando assinatura. ✓
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <TH>Paciente</TH>
                  <TH>Criado em</TH>
                  <TH>Status</TH>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendentes.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <TD className="font-medium text-gray-900">{p.pacienteNome}</TD>
                    <TD>{formatDate(p.createdAt)}</TD>
                    <TD>
                      <Badge variant="warning">Em andamento</Badge>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Seção NAPA
// Dados: GET /fila + GET /ofertas
// ─────────────────────────────────────────────────────────────────────────────

const DashNapa: React.FC<{
  fila: FilaDash[];
  ofertas: OfertaDash[];
}> = ({ fila, ofertas }) => {
  const urgentes   = fila.filter(f => f.prioridade === 'URGENTE').length;
  const totalVagas = ofertas.reduce((s, o) => s + o.vagas, 0);

  const segFila: DonutSegment[] = [
    { label: 'Urgentes', value: fila.filter(f => f.prioridade === 'URGENTE').length, color: '#ef4444' },
    { label: 'Normais',  value: fila.filter(f => f.prioridade === 'NORMAL').length,  color: '#3b82f6' },
    { label: 'Eletivos', value: fila.filter(f => f.prioridade === 'ELETIVO').length, color: '#22c55e' },
  ];

  // Próximas 5 ofertas (ordenadas por data)
  const barOfertas = [...ofertas]
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 5)
    .map(o => ({
      label: formatDate(o.data),
      value: o.vagas,
      color: '#3b82f6',
    }));

  // Fila já chega ordenada por prioridade (FilaEsperaService.listarOrdenada)
  const filaVis = fila.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total na fila"
          value={fila.length}
          sub="pacientes aguardando"
        />
        <KpiCard
          label="Urgentes"
          value={urgentes}
          sub="prioridade máxima"
          valueClass={urgentes > 0 ? 'text-red-600' : 'text-gray-900'}
        />
        <KpiCard
          label="Vagas disponíveis"
          value={totalVagas}
          sub="soma de todas as ofertas"
          valueClass="text-blue-600"
        />
        <KpiCard
          label="Ofertas cadastradas"
          value={ofertas.length}
          sub="consultas planejadas"
          valueClass="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Fila por prioridade">
          {fila.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Fila vazia.</p>
          ) : (
            <DonutWithLegend segments={segFila} />
          )}
        </SectionCard>

        <SectionCard title="Vagas por oferta (próximas 5)">
          {barOfertas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhuma oferta cadastrada.
            </p>
          ) : (
            <BarList items={barOfertas} />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Fila de espera (ordenada por prioridade)">
        {filaVis.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Fila vazia.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <TH>#</TH>
                  <TH>Paciente</TH>
                  <TH>Prioridade</TH>
                  <TH>Adicionado em</TH>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filaVis.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <TD className="text-gray-400 w-8">{idx + 1}</TD>
                    <TD className="font-medium text-gray-900">{f.pacienteNome}</TD>
                    <TD>
                      <Badge variant={prioridadeVariant(f.prioridade)}>
                        {prioridadeLabel(f.prioridade)}
                      </Badge>
                    </TD>
                    <TD>{formatDate(f.createdAt)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Seção ADMIN / COORDENADOR
// Dados: GET /prontuarios + GET /fila + GET /ofertas + GET /usuarios
// ─────────────────────────────────────────────────────────────────────────────

const DashAdmin: React.FC<{
  prontuarios: ProntuarioDash[];
  fila: FilaDash[];
  ofertas: OfertaDash[];
  usuarios: UsuarioDash[];
}> = ({ prontuarios, fila, ofertas, usuarios }) => {
  const emAndamento = prontuarios.filter(p => p.status === 'EM_ANDAMENTO').length;
  const assinados   = prontuarios.filter(p => p.status === 'ASSINADO').length;
  const arquivados  = prontuarios.filter(p => p.status === 'ARQUIVADO').length;
  const urgentes    = fila.filter(f => f.prioridade === 'URGENTE').length;
  const totalVagas  = ofertas.reduce((s, o) => s + o.vagas, 0);

  // Contagem de usuários por perfil
  const byPerfil = usuarios.reduce(
    (acc, u) => { acc[u.perfil] = (acc[u.perfil] || 0) + 1; return acc; },
    {} as Record<string, number>,
  );

  const segUsuarios: DonutSegment[] = [
    { label: 'Estudantes',  value: byPerfil['ESTUDANTE'] || 0, color: '#3b82f6' },
    { label: 'Professores', value: byPerfil['PROFESSOR'] || 0, color: '#9333ea' },
    { label: 'NAPA',        value: byPerfil['NAPA']      || 0, color: '#f97316' },
    { label: 'Admins',      value: byPerfil['ADMIN']     || 0, color: '#ef4444' },
  ];

  const segStatus: DonutSegment[] = [
    { label: 'Em andamento', value: emAndamento, color: '#f59e0b' },
    { label: 'Assinados',    value: assinados,   color: '#22c55e' },
    { label: 'Arquivados',   value: arquivados,  color: '#9ca3af' },
  ];

  const barFila = [
    { label: 'Urgentes', value: fila.filter(f => f.prioridade === 'URGENTE').length, color: '#ef4444' },
    { label: 'Normais',  value: fila.filter(f => f.prioridade === 'NORMAL').length,  color: '#3b82f6' },
    { label: 'Eletivos', value: fila.filter(f => f.prioridade === 'ELETIVO').length, color: '#22c55e' },
  ];

  const meses = countByMonth(prontuarios);

  const prontuariosRecentes = [...prontuarios]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const usuariosRecentes = [...usuarios]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Usuários cadastrados"
          value={usuarios.length}
          sub="no sistema"
          valueClass="text-blue-600"
        />
        <KpiCard
          label="Prontuários"
          value={prontuarios.length}
          sub={`${emAndamento} em andamento`}
        />
        <KpiCard
          label="Fila de espera"
          value={fila.length}
          sub={urgentes > 0 ? `${urgentes} urgente${urgentes > 1 ? 's' : ''}` : 'sem urgentes'}
          valueClass={urgentes > 0 ? 'text-red-600' : 'text-gray-900'}
        />
        <KpiCard
          label="Vagas em oferta"
          value={totalVagas}
          sub={`${ofertas.length} oferta${ofertas.length !== 1 ? 's' : ''} cadastrada${ofertas.length !== 1 ? 's' : ''}`}
          valueClass="text-green-600"
        />
      </div>

      {/* Gráficos — 3 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Usuários por perfil">
          {usuarios.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Carregando…</p>
          ) : (
            <DonutWithLegend segments={segUsuarios} />
          )}
        </SectionCard>

        <SectionCard title="Status dos prontuários">
          {prontuarios.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sem prontuários.</p>
          ) : (
            <DonutWithLegend segments={segStatus} />
          )}
        </SectionCard>

        <SectionCard title="Fila de espera por prioridade">
          {fila.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Fila vazia.</p>
          ) : (
            <BarList items={barFila} />
          )}
        </SectionCard>
      </div>

      {/* Mini bar chart — evolução mensal */}
      <SectionCard title="Prontuários criados — últimos 6 meses">
        <MiniBarChart data={meses} color="#3b82f6" />
      </SectionCard>

      {/* Tabelas lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Prontuários recentes">
          {prontuariosRecentes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sem prontuários.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <TH>Paciente</TH>
                    <TH>Data</TH>
                    <TH>Status</TH>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prontuariosRecentes.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <TD className="font-medium text-gray-900">{p.pacienteNome}</TD>
                      <TD>{formatDate(p.createdAt)}</TD>
                      <TD>
                        <Badge variant={statusVariant(p.status)}>
                          {statusLabel(p.status)}
                        </Badge>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Usuários cadastrados recentemente">
          {usuariosRecentes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sem usuários.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <TH>Nome</TH>
                    <TH>Perfil</TH>
                    <TH>Cadastro</TH>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosRecentes.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <TD className="font-medium text-gray-900">{u.nome}</TD>
                      <TD>
                        <Badge variant={perfilBadgeVariant(u.perfil)}>
                          {perfilLabel(u.perfil)}
                        </Badge>
                      </TD>
                      <TD>{formatDate(u.createdAt)}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { prontuarios, fila, ofertas, usuarios, loading } =
    useDashboardData(user.perfil);

  const primeiroNome = user.nome.split(' ')[0];

  const descricaoPorPerfil: Record<UserPerfil, string> = {
    ESTUDANTE:  'Acompanhe seus prontuários e progresso clínico.',
    PROFESSOR:  'Gerencie assinaturas e monitore a fila de espera.',
    NAPA:       'Gerencie a fila de espera e as ofertas de consulta.',
    ADMIN:      'Visão completa do sistema — usuários, prontuários e agenda.',
  };

  return (
    <div>
      <PageHeader
        titulo="Visão Geral"
        descricao={`Bem-vindo, ${primeiroNome}. ${descricaoPorPerfil[user.perfil]}`}
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {user.perfil === 'ESTUDANTE' && (
            <DashEstudante prontuarios={prontuarios} />
          )}
          {user.perfil === 'PROFESSOR' && (
            <DashProfessor
              prontuarios={prontuarios}
              fila={fila}
              userId={user.id}
            />
          )}
          {user.perfil === 'NAPA' && (
            <DashNapa fila={fila} ofertas={ofertas} />
          )}
          {user.perfil === 'ADMIN' && (
            <DashAdmin
              prontuarios={prontuarios}
              fila={fila}
              ofertas={ofertas}
              usuarios={usuarios}
            />
          )}
        </>
      )}
    </div>
  );
};
