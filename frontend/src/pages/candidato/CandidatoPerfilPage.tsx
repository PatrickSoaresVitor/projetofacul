// src/pages/candidato/CandidatoPerfilPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Candidato } from "../../types";
import CandidatoSubtiposForm from "../../components/candidato/CandidatoSubtiposForm";
import CandidatoBarreirasForm from "../../components/candidato/CandidatoBarreirasForm";

export default function CandidatoPerfilPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      const data = await api.getCandidato(candidatoId);
      setCandidato(data);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar candidato");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(candidatoId)) return;
    carregar();
  }, [candidatoId]);

  if (loading) {
    return <div className="card">Carregando...</div>;
  }

  if (erro) {
    return <div className="card text-red-600">{erro}</div>;
  }

  if (!candidato) {
    return <div className="card">Candidato não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Subtipos e barreiras</h2>
        <p className="text-gray-600">
          Configure seus subtipos de deficiência e as barreiras associadas. Essas
          informações serão usadas para encontrar vagas compatíveis.
        </p>
      </header>

      <CandidatoSubtiposForm candidatoId={candidatoId} onUpdated={carregar} />

      {candidato.subtipos?.map((s) => (
        <CandidatoBarreirasForm
          key={s.subtipoId}
          candidatoId={candidatoId}
          subtipo={s.subtipo}
        />
      ))}
    </div>
  );
}
