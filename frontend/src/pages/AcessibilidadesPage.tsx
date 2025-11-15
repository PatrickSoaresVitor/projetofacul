import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Acessibilidade } from "../types";

import AcessibilidadeForm from "../components/AcessibilidadeForm";
import VincularAcessibilidadeForm from "../components/VincularAcessibilidadeForm";

export default function AcessibilidadesPage() {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarAcessibilidades();
      setAcessibilidades(data);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao carregar barreiras");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // 🔹 NOVO: excluir acessibilidade
  async function handleExcluir(id: number) {
    const ok = window.confirm(
      "Tem certeza que deseja excluir esta acessibilidade? Os vínculos com barreiras e vagas serão removidos."
    );
    if (!ok) return;

    try {
      setErro(null);
      setExcluindoId(id);
      await api.excluirAcessibilidade(id);
      await carregar();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao excluir acessibilidade");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Acessibilidade</h1>
        <p className="text-gray-600">
          Crie novas acessibilidades e vincule a barreiras.
        </p>
      </header>

      <AcessibilidadeForm onCreated={carregar} />
      <VincularAcessibilidadeForm onLinked={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">
            Acessibilidades cadastradas
          </h3>
          <ul className="divide-y">
            {acessibilidades.map((a) => (
              <li
                key={a.id}
                className="py-2 flex items-center justify-between text-sm"
              >
                <span>{a.descricao}</span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-xs text-gray-400">#{a.id}</span>
                  <button
                    type="button"
                    onClick={() => handleExcluir(a.id)}
                    disabled={excluindoId === a.id}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    {excluindoId === a.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
