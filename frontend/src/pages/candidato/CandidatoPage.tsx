import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Candidato } from "../../types";
import CandidatoSubtiposForm from "../../components/candidato/CandidatoSubtiposForm";
import CandidatoBarreirasForm from "../../components/candidato/CandidatoBarreirasForm";

export default function CandidatoPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      const data = await api.getCandidato(candidatoId);
      setCandidato(data);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar candidato");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [candidatoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="container-page py-8">
          <div className="card">Carregando...</div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="container-page py-8">
          <div className="card text-red-600">{erro}</div>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="container-page py-8">
          <div className="card">Candidato não encontrado.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container-page space-y-6 py-8">
        <header>
          <nav className="flex flex-wrap gap-2 mb-4">
            <NavLink
              to={`/candidato/${candidatoId}`}
              className={({ isActive }) =>
                ["btn text-xs sm:text-sm", isActive ? "btn-primary" : ""].join(
                  " "
                )
              }
            >
              Subtipos e Barreiras
            </NavLink>

            <NavLink
              to={`/candidato/${candidatoId}/vagas`}
              className={({ isActive }) =>
                ["btn text-xs sm:text-sm", isActive ? "btn-primary" : ""].join(
                  " "
                )
              }
            >
              Minhas vagas
            </NavLink>

            <NavLink
              to={`/`}
              className="btn text-xs sm:text-sm"
            >
              SAIR
            </NavLink>
          </nav>
          <h1 className="text-2xl font-bold">Candidato: {candidato.nome}</h1> 
          <h1 className="text-2xl font-bold">Escolaridade: {candidato.escolaridade}</h1> 
          <p className="text-gray-600">Configure seus subtipos e barreiras.</p>
        </header>

        <CandidatoSubtiposForm candidatoId={candidatoId} onUpdated={carregar} />

        {candidato.subtipos?.map((s) => (
          <CandidatoBarreirasForm
            key={s.subtipoId}
            candidatoId={candidatoId}
            subtipo={s.subtipo}
          />
        ))}
      </div>
    </div>
  );
}
