// src/components/candidato/CandidatoBarreirasForm.tsx
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

  // 1) Barreiras possíveis para esse subtipo
  async function carregarBarreirasDoSubtipo() {
    try {
      const b = await api.listarBarreirasPorSubtipo(subtipo.id);
      setBarreiras(b.barreiras || []);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  // 2) Barreiras JÁ MARCADAS para esse candidato + subtipo
  async function carregarSelecionadas() {
    try {
      const perfil = await api.listarBarreirasCandidato(candidatoId);

      // perfil é um array de CandidatoSubtipoBarreira com barreira dentro
      const registrosDoSubtipo = perfil.filter(
        (r: any) => r.subtipoId === subtipo.id
      );

      const ids = registrosDoSubtipo.map((r: any) => r.barreiraId);
      setSelecionadas(ids);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    setOk(false);
    setErro(null);
    carregarBarreirasDoSubtipo();
    carregarSelecionadas();
  }, [subtipo.id, candidatoId]);

  // 3) Salvar = PUT idempotente
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
    setOk(false);
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
        {barreiras.length === 0 ? (
          <p className="text-sm text-gray-500">
            Não há barreiras cadastradas para este subtipo.
          </p>
        ) : (
          barreiras.map((b) => (
            <label key={b.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selecionadas.includes(b.id)}
                onChange={() => toggle(b.id)}
              />
              <span>{b.descricao}</span>
            </label>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSalvar}
          className="btn btn-primary"
          disabled={barreiras.length === 0}
        >
          Salvar barreiras
        </button>
      </div>
    </div>
  );
}
