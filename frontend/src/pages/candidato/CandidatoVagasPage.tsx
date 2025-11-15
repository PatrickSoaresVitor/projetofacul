// src/pages/candidato/CandidatoVagasPage.tsx
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { api } from "../../lib/api";
import type { Vaga } from "../../types";

export default function CandidatoVagasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aplicadas, setAplicadas] = useState<Set<number>>(new Set());

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const [vagasData, cands] = await Promise.all([
        api.listarVagasCompativeis(candidatoId),
        api.listarCandidaturas(candidatoId),
      ]);

      setVagas(vagasData);
      setAplicadas(new Set(cands.map((c) => c.vagaId)));
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar vagas compatíveis");
    } finally {
      setLoading(false);
    }
  }

  async function handleCandidatar(vagaId: number) {
    try {
      await api.candidatarVaga(candidatoId, vagaId);
      setAplicadas((prev) => new Set(prev).add(vagaId)); // atualiza UI na hora
      alert("Candidatura registrada com sucesso!");
    } catch (err: any) {
      alert(err.message ?? "Erro ao se candidatar.");
    }
  }

  useEffect(() => {
    carregar();
  }, [candidatoId]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container-page space-y-6 py-8">
        <header className="space-y-2">
          <h1 className="page-title">Vagas compatíveis</h1>
          <p className="page-description">
            Veja as vagas que atendem às suas necessidades de acessibilidade.
          </p>
        </header>

        {loading ? (
          <div className="card">Carregando...</div>
        ) : erro ? (
          <div className="card text-red-600">{erro}</div>
        ) : vagas.length === 0 ? (
          <div className="card text-slate-500">
            Nenhuma vaga compatível encontrada.
          </div>
        ) : (
          <div className="card space-y-3">
            <h3 className="text-lg font-semibold mb-3">
              Vagas encontradas
            </h3>
            <ul className="divide-y">
              {vagas.map((v) => {
                const jaCandidatado = aplicadas.has(v.id);
                return (
                  <li key={v.id} className="py-3 space-y-1 ">
                    <p className="font-medium">{v.descricao}</p>
                    <p className="text-sm text-slate-500">
                      Empresa: {v.empresa?.nome ?? "—"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Escolaridade: {v.escolaridade}
                    </p>
                    <button
                      type="button"
                      disabled={jaCandidatado}
                      onClick={() => handleCandidatar(v.id)}
                      className={`mt-2 inline-flex px-3 py-1 rounded text-sm font-medium transition ${
                        jaCandidatado
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      {jaCandidatado ? "Já candidatado" : "Candidatar-se"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
