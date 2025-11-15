// src/components/empresa/VagaAcessibilidadesForm.tsx
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Acessibilidade, Vaga } from "../../types";

type Props = {
  vagaId: number;
};

export default function VagaAcessibilidadesForm({ vagaId }: Props) {
  const [acess, setAcess] = useState<Acessibilidade[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function carregar() {
    try {
      setErro(null);
      setOk(false);

      const [possiveis, vaga] = await Promise.all([
        api.listarAcessibilidadesPossiveis(vagaId),
        api.obterVagaComSubtipos(vagaId),
      ]);

      setAcess(possiveis);

      const v = vaga as Vaga;
      const jaSelecionadas = v.acessibilidades?.map((a) => a.id) ?? [];
      setSelecionadas(jaSelecionadas);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar acessibilidades");
    }
  }

  useEffect(() => {
    carregar();
  }, [vagaId]);

  function toggleSelecionada(id: number) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSalvar() {
    setErro(null);
    setOk(false);
    setLoading(true);

    try {
      // substitui TODAS as acessibilidades da vaga pela lista atual
      await api.vincularAcessibilidadesAVaga(vagaId, selecionadas);
      setOk(true);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao vincular acessibilidades");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3 shadow-md">
      <h3 className="text-lg font-semibold">
        Selecionar acessibilidades oferecidas
      </h3>

      {erro && <p className="text-red-600">{erro}</p>}
      {ok && <p className="text-green-600">Acessibilidades atualizadas!</p>}

      <div className="max-h-60 overflow-y-auto space-y-2">
        {acess.map((a) => (
          <label key={a.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selecionadas.includes(a.id)}
              onChange={() => toggleSelecionada(a.id)}
            />
            <span>{a.descricao}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Se deixar tudo desmarcado, a vaga ficará sem acessibilidades
          cadastradas.
        </span>
        <button
          onClick={handleSalvar}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Salvando..." : "Salvar acessibilidades"}
        </button>
      </div>
    </div>
  );
}
