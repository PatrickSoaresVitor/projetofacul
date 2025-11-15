// src/pages/candidato/CandidatoHome.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Candidato, Vaga, VagaCandidato } from "../../types";

export default function CandidatoHome() {
  const { id } = useParams();
  const candidatoId = Number(id);

  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [vagasCompativeis, setVagasCompativeis] = useState<Vaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<VagaCandidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setLoading(true);

      const [cand, vagas, candidaturasResp] = await Promise.all([
        api.getCandidato(candidatoId),
        api.listarVagasCompativeis(candidatoId),
        api.listarCandidaturas(candidatoId),
      ]);

      setCandidato(cand);
      setVagasCompativeis(vagas);
      setCandidaturas(candidaturasResp);
    } catch (e: any) {
      setErro("Erro ao carregar visão geral do candidato");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(candidatoId)) return;
    carregar();
  }, [candidatoId]);

  if (loading) return <div className="card">Carregando...</div>;
  if (erro) return <div className="card text-red-600">{erro}</div>;
  if (!candidato) return null;

  const totalVagasCompativeis = vagasCompativeis.length;
  const totalCandidaturas = candidaturas.length;
  const vagasJaCandidatado = new Set(candidaturas.map((c) => c.vagaId));

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div className="card py-8 text-center">
        <h2 className="text-xl font-bold mb-2">
          Bem-vindo(a), {candidato.nome}!
        </h2>
        <p className="text-gray-600 text-sm">
          Aqui você acompanha suas vagas compatíveis, candidaturas e pode
          entender melhor como o portal está encontrando oportunidades para o
          seu perfil.
        </p>
      </div>

      {/* Resumo */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Vagas compatíveis</p>
          <p className="text-2xl font-bold">{totalVagasCompativeis}</p>
          <p className="text-xs text-slate-500 mt-2">
            Baseado nos seus subtipos, barreiras e acessibilidades.
          </p>
        </div>

        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Candidaturas realizadas</p>
          <p className="text-2xl font-bold">{totalCandidaturas}</p>
          <p className="text-xs text-slate-500 mt-2">
            Acompanhe o status direto na página de vagas compatíveis.
          </p>
        </div>

        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Escolaridade</p>
          <p className="text-lg font-semibold">
            {candidato.escolaridade || "Não informado"}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Informação usada como filtro adicional pelas empresas.
          </p>
        </div>
      </section>

      {/* Lista resumida de vagas compatíveis */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            Vagas recomendadas para o seu perfil
          </h3>
          <Link
            to={`/candidato/${candidatoId}/vagas`}
            className="text-xs text-primary font-medium hover:underline"
          >
            Ver todas as vagas compatíveis
          </Link>
        </div>

        {vagasCompativeis.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não encontramos vagas para o seu perfil. Mantenha seus dados
            atualizados e volte em breve.
          </p>
        ) : (
          <ul className="space-y-3">
            {vagasCompativeis.slice(0, 5).map((vaga) => (
              <li
                key={vaga.id}
                className="border rounded-md p-3 bg-slate-50 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    #{vaga.id} • {vaga.descricao}
                  </p>
                  <span className="text-xs text-slate-500">
                    {vaga.escolaridade}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Empresa: {vaga.empresa?.nome ?? "Não informado"}
                </p>
                <p className="text-xs">
                  Status:{" "}
                  {vagasJaCandidatado.has(vaga.id) ? (
                    <span className="text-emerald-600 font-medium">
                      já candidatado
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      você ainda não se candidatou
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
