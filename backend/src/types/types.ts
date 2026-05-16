//Perfis de usuário disponíveis no sistema
export type Perfil = 'ESTUDANTE' | 'PROFESSOR' | 'NAPA' | 'ADMIN'
//Prioridades da fila de espera
export type Prioridade = 'URGENTE' | 'NORMAL' | 'ELETIVO'
//Status de agendamento
export type StatusAgenda = 'DISPONIVEL' | 'AGENDADO' | 'CANCELADO'
//Tipo de estágio do estudante
export type TipoEstagio = 'CURRICULAR' | 'EXTRACURRICULAR'

//Dados específicos por perfil
export interface DadosEstudante {
  tipoEstagio: TipoEstagio        //obrigatório para ESTUDANTE
  nomeSupervisor: string          //nome do professor supervisor
  nomeCurso: string               //ex: "Odontologia"
  periodoAtual: number            //ex: 6
  previsaoConclusao: string       //data ex: "2026-12-01"
}
export interface DadosProfessor {
  conselhoProfissional: string    //ex: "CRO", "CRM"
  numeroRegistro: string          //número único no conselho
  estadoRegistro: string          //ex: "PE"
  dataValidade: string            //data ex: "2027-01-01"
}

//Dados gerais — todos os perfis podem ter
export interface DadosGerais {
  clinicaAtuacao?: string         //ex: "Clínica de Dentística"
  diasLivres?: string             //JSON com dias/turnos ex: '{"SEGUNDA":["MANHA","TARDE"]}'
}


//união dos dados comuns + específicos por perfil
export interface DadosCadastroBase extends DadosGerais {
  nome: string
  email: string
  senha: string
  perfil: Perfil
  nacionalidade?: string          //padrão: "Brasileira"
  cpf?: string                    //único no sistema
  telefone?: string               //ex: "+5581999999999"
  dataNascimento?: string         //data
}

//estudante: base + campos obrigatórios de estudante
export interface DadosCadastroEstudante extends DadosCadastroBase, DadosEstudante {
  perfil: 'ESTUDANTE'
}

//professor: base + campos obrigatórios de professor
export interface DadosCadastroProfessor extends DadosCadastroBase, DadosProfessor {
  perfil: 'PROFESSOR'
}

// NAPA: só os dados base
export interface DadosCadastroNapa extends DadosCadastroBase {
  perfil: 'NAPA'
}
//ADMIN: dados base
export interface DadosCadastroAdmin extends DadosCadastroBase {
  perfil: 'ADMIN'
}

//união de todos os tipos possíveis de cadastro
export type DadosCadastro =
  | DadosCadastroEstudante
  | DadosCadastroProfessor
  | DadosCadastroNapa
  | DadosCadastroAdmin