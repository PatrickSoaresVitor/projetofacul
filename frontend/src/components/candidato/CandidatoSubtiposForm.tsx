import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  onUpdated: () => void;
};

export default function CandidatoSubtiposForm({ candidatoId, onUpdated }: Props) {
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.listarSubtipos().then(setSubtipos).catch((e) => setErro(e.message));
  }, []);

  async function handleSalvar() {
    setErro(null);
    if (!selecionados.length) {
      setErro("Selecione pelo menos um subtipo.");
      return;
    }
    try {
      await api.vincularSubtiposACandidato(candidatoId, selecionados);
      setOk(true);
      onUpdated();
    } catch (err: any) {
      setErro(err.message ?? "Erro ao vincular subtipos");
    }
  }

  function toggle(id: number) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">Selecione seus subtipos</h3>
      {erro && <p className="text-red-600">{erro}</p>}
      {ok && <p className="text-green-600">Subtipos atualizados!</p>}

      <div className="max-h-60 overflow-y-auto space-y-2">
        {subtipos.map((s) => (
          <label key={s.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selecionados.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            <span>{s.nome}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSalvar} className="btn btn-primary">
          Salvar subtipos
        </button>
      </div>
    </div>
  );
}
