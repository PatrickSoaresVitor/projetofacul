import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Acessibilidade } from "../../types";

type Props = {
  vagaId: number;
};

export default function VagaAcessibilidadesForm({ vagaId }: Props) {
  const [acess, setAcess] = useState<Acessibilidade[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function carregarAcessibilidades() {
    try {
      const data = await api.listarAcessibilidadesPossiveis(vagaId);
      setAcess(data);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar acessibilidades");
    }
  }

  async function handleSalvar() {
    setErro(null);
    setOk(false);

    if (!selecionadas.length) {
      setErro("Selecione pelo menos uma acessibilidade.");
      return;
    }

    setLoading(true);
    try {
      await api.vincularAcessibilidadesAVaga(vagaId, selecionadas);
      setOk(true);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao vincular acessibilidades");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelecionada(id: number) {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    carregarAcessibilidades();
  }, []);

  return (
    <div className="card space-y-3 shadow-md">
      <h3 className="text-lg font-semibold">Selecionar acessibilidades oferecidas</h3>

      {erro && <p className="text-red-600">{erro}</p>}
      {ok && <p className="text-green-600">Acessibilidades vinculadas com sucesso!</p>}

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

      <div className="flex justify-end">
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
