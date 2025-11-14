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

  // 1️⃣ Carrega todas as barreiras POSSÍVEIS desse subtipo
  async function carregarBarreirasDoSubtipo() {
    try {
      const b = await api.listarBarreirasPorSubtipo(subtipo.id);
      setBarreiras(b.barreiras || []);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  // 2️⃣ Carrega as barreiras que o CANDIDATO já tem para este subtipo
  async function carregarSelecionadas() {
    try {
      const dados = await api.listarBarreirasCandidato(candidatoId);

      // Não sabemos o shape exato, então vamos ser defensivos:
      // procurar pelo subtipo correspondente e pegar sua lista de barreiras
      const registro = (dados as any[]).find((item) => {
        // tenta bater por subtipoId direto ou por item.subtipo.id
        return item.subtipoId === subtipo.id || item.subtipo?.id === subtipo.id;
      });

      const ids =
        registro?.barreiras?.map((b: Barreira) => b.id) ??
        registro?.subtipo?.barreiras?.map((b: Barreira) => b.id) ??
        [];

      setSelecionadas(ids);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    carregarBarreirasDoSubtipo();
    carregarSelecionadas();
  }, [candidatoId, subtipo.id]);

  // 3️⃣ Salvar = PUT (substitui tudo; permite zerar)
  async function handleSalvar() {
    setErro(null);
    setOk(false);

    try {
      await api.salvarBarreirasDoSubtipo(
        candidatoId,
        subtipo.id,
        selecionadas
      );
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
      {ok && <p className="text-green-600">Barreiras atualizadas!</p>}

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
