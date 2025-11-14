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

  // Carrega TODOS os subtipos existentes
  async function carregarSubtipos() {
    try {
      const lista = await api.listarSubtipos();
      setSubtipos(lista);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  // Carrega os subtipos que o candidato JÁ TEM
  async function carregarSelecionados() {
  try {
    const perfil = await api.getCandidato(candidatoId);

    const ids =
      (perfil.subtipos ?? [])
        .map((s: any) => s?.subtipo?.id as number | undefined)
        .filter((id): id is number => typeof id === "number" && Number.isInteger(id));

    setSelecionados(ids);
  } catch (e: any) {
    setErro(e.message);
  }
}


  useEffect(() => {
    carregarSubtipos();
    carregarSelecionados();
  }, [candidatoId]);

  // Salvar usando PUT (sobrescreve tudo)
  async function handleSalvar() {
    setErro(null);
    setOk(false);

    try {
      await api.salvarSubtiposDoCandidato(candidatoId, selecionados);
      setOk(true);
      onUpdated();
    } catch (err: any) {
      setErro(err.message ?? "Erro ao salvar subtipos");
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
      {ok && <p className="text-green-600">Subtipos atualizados com sucesso!</p>}

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
