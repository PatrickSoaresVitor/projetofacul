import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";

import type { Vaga } from "../../types";
import VagaForm from "../../components/empresa/VagaForm";
import VagaList from "../../components/empresa/VagaList";

export default function VagasPage() {
  const { id } = useParams(); // id da empresa
  const empresaId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      const data = await api.listarVagas(empresaId);
      setVagas(data);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [empresaId]);

  return (
    <div className="container-page space-y-6 py-8">
      <header className="space-y-1">
        <h1 className="page-title">Vagas da Empresa</h1>
        <p className="page-description">
          Crie e visualize as vagas cadastradas.
        </p>
      </header>

      <VagaForm empresaId={empresaId} onCreated={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <VagaList vagas={vagas} />
      )}
    </div>
  );
}
