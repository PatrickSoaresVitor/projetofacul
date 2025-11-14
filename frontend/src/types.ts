export type Barreira = {
  id: number;
  descricao: string;
  acessibilidades: Acessibilidade[]
  createdAt?: string;
  updatedAt?: string;
};

export type Acessibilidade = {
  id: number;
  descricao: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TipoDeficiencia = {
  id: number;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SubtipoDeficiencia = {
  id: number;
  nome: string;
  tipoId: number;
  createdAt?: string;
  updatedAt?: string;
};

// útil para listar: cada tipo com seus subtipos
export type TipoComSubtipos = TipoDeficiencia & {
  subtipos: SubtipoDeficiencia[];
};

export type Empresa = {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Vaga = {
  id: number;
  descricao: string;
  escolaridade: string;
  empresa: Empresa;
  subtipos: SubtipoDeficiencia[];
  createdAt?: string;
  updatedAt?: string;
  candidaturas?: VagaCandidato[];

};

export type Candidato = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string
  escolaridade: string;
  subtipos?: CandidatoSubtipo[];
  candidaturas?: VagaCandidato[];
};

export type CandidatoSubtipo = {
  subtipoId: number;
  subtipo: SubtipoDeficiencia;
  barreiras?: CandidatoSubtipoBarreira[];
};

export type CandidatoSubtipoBarreira = {
  barreiraId: number;
  barreira: Barreira;
};

export type VagaCandidato = {
  vagaId: number;
  candidatoId: number;
  createdAt: string;      // ISO string do backend
  vaga?: Vaga;            // presentes só quando o backend incluir via include
  candidato?: Candidato;  // idem
};