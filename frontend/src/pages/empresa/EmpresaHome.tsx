import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Empresa, Vaga } from "../../types";

export default function EmpresaHome() {
  const { id } = useParams();
  const empresaId = Number(id);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setLoading(true);

      const [emp, vagasEmpresa] = await Promise.all([
        api.buscarEmpresa(empresaId),
        api.listarVagas(empresaId),
      ]);

      setEmpresa(emp);
      setVagas(vagasEmpresa);
    } catch (e: any) {
      setErro("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(empresaId)) return;
    carregar();
  }, [empresaId]);

  if (loading) return <div className="card">Carregando...</div>;
  if (erro) return <div className="card text-red-600">{erro}</div>;
  if (!empresa) return null;

  const totalCandidaturas = vagas.reduce(
    (sum, v) => sum + (v.candidaturas?.length ?? 0),
    0
  );

  const candidatosUnicos = new Set(
    vagas.flatMap((v) => v.candidaturas?.map((c) => c.candidatoId) ?? [])
  ).size;

  return (
    <div className="space-y-8">
      {/* Bem-vindo */}
      <div className="card py-10 text-center">
        <h2 className="text-xl font-bold mb-2">Bem-vindo(a), {empresa.nome}!</h2>
        <p className="text-gray-600">
          No menu acima, acesse suas vagas, veja candidatos ou crie novas oportunidades.
        </p>
      </div>

      {/* Resumo */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-xs text-slate-500">Vagas ativas</p>
          <p className="text-2xl font-bold">{vagas.length}</p>
        </div>

        <div className="card">
          <p className="text-xs text-slate-500">Candidaturas recebidas</p>
          <p className="text-2xl font-bold">{totalCandidaturas}</p>
        </div>

        <div className="card">
          <p className="text-xs text-slate-500">Candidatos distintos</p>
          <p className="text-2xl font-bold">{candidatosUnicos}</p>
        </div>
      </section>

      {/* Lista de vagas e candidatos */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4">
          Candidatos com match nas suas vagas
        </h3>

        {vagas.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma vaga criada.</p>
        ) : (
          <div className="space-y-4">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="border rounded-lg p-3 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    #{vaga.id} • {vaga.descricao}
                  </p>
                  <span className="text-xs text-slate-500">
                    {vaga.candidaturas?.length ?? 0} candidatos
                  </span>
                </div>

                {(vaga.candidaturas?.length ?? 0) === 0 ? (
                  <p className="text-xs text-slate-400">
                    Nenhum candidato ainda.
                  </p>
                ) : (
                  <ul className="mt-2 border-t pt-2 space-y-1">
                    {vaga.candidaturas!.map((c) => (
                      <li
                        key={c.candidatoId}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="font-medium">
                          {c.candidato?.nome ?? "Candidato"}
                        </span>
                        <span className="text-slate-400">
                          ID #{c.candidatoId}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
