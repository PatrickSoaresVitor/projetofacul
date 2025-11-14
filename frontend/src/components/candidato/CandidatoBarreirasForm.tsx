import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Barreira, SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  subtipo: SubtipoDeficiencia;
};

export default function CandidatoBarreirasForm({ candidatoId, subtipo }: Props) {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.listarBarreirasPorSubtipo(subtipo.id)
      .then((b) => setBarreiras(b.barreiras || []))
      .catch((e) => setErro(e.message));
  }, [subtipo.id]);

  async function handleSalvar() {
    if (!selecionadas.length) {
      setErro("Selecione pelo menos uma barreira.");
      return;
    }
    try {
      await api.vincularBarreirasACandidato(candidatoId, subtipo.id, selecionadas);
      setOk(true);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao salvar barreiras");
    }
  }

  function toggle(id: number) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">
        Barreiras para {subtipo.nome}
      </h3>

      {erro && <p className="text-red-600">{erro}</p>}
      {ok && <p className="text-green-600">Barreiras salvas!</p>}

      <div className="max-h-60 overflow-y-auto space-y-2">
        {barreiras.map((b) => (
          <label key={b.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selecionadas.includes(b.id)}
              onChange={() => toggle(b.id)}
            />
            <span>{b.descricao}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSalvar} className="btn btn-primary">
          Salvar barreiras
        </button>
      </div>
    </div>
  );
}
