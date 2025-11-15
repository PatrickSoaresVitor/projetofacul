// src/pages/admin/AdminTiposPage.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { TipoDeficiencia } from "../types";

export default function AdminTiposPage() {
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      const data = await api.listarTipos();
      setTipos(data);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar tipos");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      setLoading(true);
      await api.criarTipo(nome.trim());
      setNome("");
      await carregar();
    } catch (err: any) {
      setErro(err.message ?? "Erro ao criar tipo");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 NOVO: excluir tipo
  async function handleExcluir(id: number) {
  const ok = window.confirm(
    "Tem certeza que deseja excluir este tipo? Isso removerá também seus subtipos."
  );
  if (!ok) return;

  try {
    setErro(null);
    await api.excluirTipo(id);   // não explode mais
    await carregar();            // recarrega a lista
  } catch (err: any) {
    setErro(err.message ?? "Erro ao excluir tipo");
  }
}


  return (
    <div className="container-page py-8 space-y-6">
      <h1 className="page-title">Tipos de Deficiência</h1>

      <form onSubmit={handleCriar} className="card space-y-3">
        <div>
          <label className="label">Nome do tipo</label>
          <input
            className="input"
            placeholder="ex: Deficiência Cognitiva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        {erro && <p className="text-red-600">{erro}</p>}

        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Criar tipo"}
          </button>
        </div>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Tipos cadastrados</h2>
        <ul className="divide-y">
          {tipos.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span>{t.nome}</span>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="text-slate-400">#{t.id}</span>
                <button
                  type="button"
                  onClick={() => handleExcluir(t.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
