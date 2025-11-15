import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Barreira } from "../types";
import BarreiraForm from "../components/BarreiraForm";
import VincularBarreiraForm from "../components/VincularBarreiraForm";

export default function BarreirasPage() {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarBarreiras();
      setBarreiras(data);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao carregar barreiras");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // 🔹 NOVO: excluir barreira
  async function handleExcluir(id: number) {
    const ok = window.confirm(
      "Tem certeza que deseja excluir esta barreira? Os vínculos com subtipos e candidatos serão removidos."
    );
    if (!ok) return;

    try {
      setErro(null);
      setExcluindoId(id);
      await api.excluirBarreira(id);
      await carregar();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao excluir barreira");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Barreiras</h1>
        <p className="text-gray-600">
          Crie novas barreiras e vincule a subtipos de deficiência.
        </p>
      </header>

      <BarreiraForm onCreated={carregar} />
      <VincularBarreiraForm onLinked={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Barreiras cadastradas</h3>
          <ul className="divide-y">
            {barreiras.map((b) => (
              <li
                key={b.id}
                className="py-2 flex items-center justify-between text-sm"
              >
                <span>{b.descricao}</span>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-gray-400">#{b.id}</span>
                  <button
                    type="button"
                    onClick={() => handleExcluir(b.id)}
                    disabled={excluindoId === b.id}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    {excluindoId === b.id ? "Excluindo..." : "Excluir"}
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
