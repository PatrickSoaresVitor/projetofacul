import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Vaga, SubtipoDeficiencia } from "../../types";
import VagaSubtiposForm from "../../components/empresa/VagaSubtiposForm";
import VagaAcessibilidadesForm from "../../components/empresa/VagaAcessibilidadesForm";

export default function VagaDetalhePage() {
  const { vagaId } = useParams();
  const id = Number(vagaId);

  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarDetalhes() {
    try {
      setErro(null);
      setLoading(true);
      const data = await api.obterVagaComSubtipos(id);
      setVaga(data);
      setSubtipos(data.subtipos);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar detalhes da vaga");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  if (loading) return <div className="card">Carregando...</div>;
  if (erro) return <div className="card text-red-600">{erro}</div>;
  if (!vaga) return <div className="card text-gray-500">Vaga não encontrada.</div>;

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Detalhes da Vaga</h1>
        <p className="text-gray-600">
          Gerencie os subtipos e acessibilidades vinculadas à vaga.
        </p>
      </header>

      <section className="card space-y-2">
        <p><strong>Descrição:</strong> {vaga.descricao}</p>
        <p><strong>Escolaridade:</strong> {vaga.escolaridade}</p>
      </section>

      <VagaSubtiposForm vagaId={id} onUpdated={carregarDetalhes} />

      {subtipos.length === 0 ? (
        <div className="card text-gray-500">
          Defina primeiro os subtipos aceitos para esta vaga.
        </div>
      ) : (
        <VagaAcessibilidadesForm vagaId={id} />
      )}
    </div>
  );
}

