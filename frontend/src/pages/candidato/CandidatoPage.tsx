import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Candidato } from "../../types";

export default function CandidatoPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setErro(null);
        if (!Number.isFinite(candidatoId)) return;
        const data = await api.getCandidato(candidatoId);
        setCandidato(data);
      } catch (err: any) {
        setErro(err.message ?? "Erro ao carregar candidato");
      } finally {
        setLoading(false);
      }
    }
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
      {/* Header com o candidato + navegação */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-page py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              {candidato.nome}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Escolaridade: {candidato.escolaridade || "Não informada"}
            </p>
            {candidato.email && (
              <p className="text-xs text-white/80">{candidato.email}</p>
            )}
          </div>

          <nav className="flex flex-wrap gap-2">
            <NavLink
              to={`/candidato/${candidatoId}`}
              end
              className={({ isActive }) =>
                [
                  "btn text-xs sm:text-sm",
                  isActive
                    ? "btn-primary"
                    : "bg-white/90 text-slate-700 border-transparent hover:bg-white",
                ].join(" ")
              }
            >
              Visão geral
            </NavLink>

            <NavLink
              to={`/candidato/${candidatoId}/perfil`}
              className={({ isActive }) =>
                [
                  "btn text-xs sm:text-sm",
                  isActive
                    ? "btn-primary"
                    : "bg-white/90 text-slate-700 border-transparent hover:bg-white",
                ].join(" ")
              }
            >
              Subtipos e barreiras
            </NavLink>

            <NavLink
              to={`/candidato/${candidatoId}/vagas`}
              className={({ isActive }) =>
                [
                  "btn text-xs sm:text-sm",
                  isActive
                    ? "btn-primary"
                    : "bg-white/90 text-slate-700 border-transparent hover:bg-white",
                ].join(" ")
              }
            >
              Vagas compatíveis
            </NavLink>

            <NavLink
              to="/home"
              className="btn text-xs sm:text-sm bg-white/90 text-slate-700 border-transparent hover:bg-white"
            >
              SAIR
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Conteúdo das rotas filhas */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
