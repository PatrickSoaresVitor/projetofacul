
import type { TipoDeficiencia, TipoComSubtipos, SubtipoDeficiencia, Barreira, Acessibilidade, Vaga, Candidato, Empresa, VagaCandidato} from "../types";
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text || res.statusText || "Erro na requisição";
    try {
      const j = JSON.parse(text);
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}


export const api = {
  listarTipos() {
    return http<TipoDeficiencia[]>("/tipos");
  },
  criarTipo(nome: string) {
    return http<TipoDeficiencia>("/tipos", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });
  },
   // novos:
  // GET /subtipos → seu backend retorna Tipos com seus subtipos
  listarTiposComSubtipos(): Promise<TipoComSubtipos[]> {
    return http("/tipos/com-subtipos");
  },
    // POST /subtipos { nome, tipoId }
  criarSubtipo(nome: string, tipoId: number): Promise<SubtipoDeficiencia> {
    return http("/subtipos", {
      method: "POST",
      body: JSON.stringify({ nome, tipoId }),
    });
  },
  listarBarreiras(): Promise<Barreira[]> {
    return http("/barreiras");
  },
  listarAcessibilidades(): Promise<Acessibilidade[]> {
    return http("/acessibilidades");
  },
  criarBarreira(descricao: string): Promise<Barreira> {
    return http("/barreiras", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },
  criarAcessibilidade(descricao: string): Promise<Acessibilidade> {
    return http("/acessibilidades", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },
  listarSubtipos(): Promise<SubtipoDeficiencia[]> {
    return http("/subtipos");
  },
  vincularBarreirasASubtipo(subtipoId: number, barreiraIds: number[]) {
    return http(`/vinculos/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
  },
  vincularAcessibilidadesABarreira(barreiraId: number, acessibilidadeIds: number[]) {
    return http(`/vinculos/barreiras/${barreiraId}/acessibilidades`, {
      method: "POST",
      body: JSON.stringify({ acessibilidadeIds }),
    });
  },
  
  vincularSubtiposAVaga(vagaId: number, subtipoIds: number[]) {
  return http(`/vagas/${vagaId}/subtipos`, {
    method: "POST",
    body: JSON.stringify({ subtipoIds }),
  });
  },
  obterVaga(vagaId: number): Promise<Vaga> {
  return http(`/vagas/${vagaId}`);
},
listarAcessibilidadesPossiveis(vagaId: number) {
  return http<Acessibilidade[]>(`/vagas/${vagaId}/acessibilidades-disponiveis`);
},
vincularAcessibilidadesAVaga(vagaId: number, acessibilidadeIds: number[]) {
  return http(`/vagas/${vagaId}/acessibilidades`, {
    method: "POST",
    body: JSON.stringify({ acessibilidadeIds }),
  });
},

obterVagaComSubtipos(vagaId: number) {
  return http<Vaga>(`/vagas/${vagaId}`);
},
// Candidatos
  getCandidato(id: number) {
    return http<Candidato>(`/candidatos/${id}`);
  },
   // Subtipos do candidato
  listarSubtiposCandidato(id: number) {
    return http<SubtipoDeficiencia[]>(`/candidatos/${id}/subtipos`);
  },
    // Barreiras de um subtipo
  listarBarreirasPorSubtipo(subtipoId: number) {
  return http<{ barreiras: Barreira[] }>(`/subtipos/${subtipoId}`);
  },
 vincularSubtiposACandidato(candidatoId: number, subtipoIds: number[]) {
    return http<void>(`/candidatos/${candidatoId}/subtipos`, {
      method: "POST",
      body: JSON.stringify({ subtipoIds }),
    });
  },
  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    return http<void>(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
  },

  salvarSubtiposDoCandidato(candidatoId: number, subtipoIds: number[]) {
    return http<void>(`/candidatos/${candidatoId}/subtipos`, {
      method: "PUT",
      body: JSON.stringify({ subtipoIds }),
    });
  },

  salvarBarreirasDoSubtipo(
    candidatoId: number,
    subtipoId: number,
    barreiraIds: number[]
  ) {
    return http<void>(
      `/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`,
      {
        method: "PUT",
        body: JSON.stringify({ barreiraIds }),
      }
    );
  },

  async listarVagasCompativeis(candidatoId: number): Promise<Vaga[]> {
    return http<Vaga[]>(`/match/${candidatoId}`);
  },

  // --- EMPRESAS ---
  criarEmpresa(nome: string, cnpj: string, email: string, senha: string) {
    return http<Empresa>("/empresas", {
      method: "POST",
      body: JSON.stringify({ nome, cnpj: cnpj.replace(/\D/g, ""), email, senha }),
    });
  },
  buscarEmpresa(id: number) {
    return http<Empresa>(`/empresas/${id}`);
  },

  listarVagas(empresaId: number) {
  return http<Vaga[]>(`/vagas/empresa/${empresaId}`);
  },

  criarVaga(empresaId: number, descricao: string, escolaridade: string) {
    return http("/vagas", {
      method: "POST",
      body: JSON.stringify({ empresaId, descricao, escolaridade }),
    });
  },

  // --- CANDIDATOS ---
  criarCandidato(nome: string, email: string, senha: string, escolaridade = "Não informado", cpf?: string) {
    return http<Candidato>("/candidatos", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha, escolaridade, cpf }),
    });
  },
  authLogin(email: string, senha: string) {
  return http<{ role: "empresa" | "candidato" | "admin"; user: { id: number; nome: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
  },
  candidatarVaga(candidatoId: number, vagaId: number) {
    return http<VagaCandidato>(`/vagas/${vagaId}/candidatar`, {
      method: "POST",
      body: JSON.stringify({ candidatoId }),
    });
  },
  listarCandidaturas(candidatoId: number) {
  return http<VagaCandidato[]>(`/candidatos/${candidatoId}/candidaturas`);

  },
  // Barreiras atuais do candidato por subtipo
  listarBarreirasCandidato(candidatoId: number) {
    // o tipo é any[] porque não sabemos exatamente o shape,
    // mas vamos tratar isso no componente
    return http<any[]>(`/candidatos/${candidatoId}/subtipos/barreiras`);
  },

};