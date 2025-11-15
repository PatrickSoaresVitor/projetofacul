import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { TipoComSubtipos } from "../types";
import SubtipoForm from "../components/SubtipoForm";
import SubtipoList from "../components/SubtipoList";

export default function SubtiposPage() {
  const [tipos, setTipos] = useState<TipoComSubtipos[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarTiposComSubtipos();
      setTipos(data);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao carregar subtipos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // 🔹 NOVO: excluir subtipo
  async function handleExcluirSubtipo(id: number) {
    const ok = window.confirm(
      "Tem certeza que deseja excluir este subtipo? Isso remove vínculos com candidatos e vagas."
    );
    if (!ok) return;

    try {
      setErro(null);
      setExcluindoId(id);
      await api.excluirSubtipo(id);
      await carregar();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao excluir subtipo");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Subtipos de Deficiência</h1>
        <p className="text-gray-600">Crie subtipos e consulte por tipo.</p>
      </header>

      <SubtipoForm onCreated={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <SubtipoList
          tipos={tipos}
          onExcluirSubtipo={handleExcluirSubtipo}
          excluindoId={excluindoId}
        />
      )}
    </div>
  );
}
