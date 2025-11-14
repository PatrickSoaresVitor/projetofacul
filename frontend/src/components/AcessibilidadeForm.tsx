import { useState } from "react";
import { api } from "../lib/api";

type Props = { onCreated: () => void };

export default function AcessibilidadeForm({ onCreated }: Props) {
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!descricao.trim()) {
      setErro("Informe uma descrição.");
      return;
    }

    setLoading(true);
    try {
      await api.criarAcessibilidade(descricao.trim());
      setDescricao("");
      onCreated();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao criar barreira");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="label">Descrição da acessibilidade</label>
        <input
          className="input"
          placeholder="ex.: Elevador"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={loading}
        />
        {erro && <p className="error">{erro}</p>}
      </div>
      <div className="flex justify-end">
        <button disabled={loading} className="btn btn-primary">
          {loading ? "Salvando..." : "Criar Acessibilidade"}
        </button>
      </div>
    </form>
  );
}