// src/pages/AdminHome.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Resumo = {
  tipos: number;
  subtipos: number;
  barreiras: number;
  acessibilidades: number;
};

export default function AdminHome() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setLoading(true);

      const [tipos, subtipos, barreiras, acessibilidades] = await Promise.all([
        api.listarTipos(),
        api.listarSubtipos(),
        api.listarBarreiras(),
        api.listarAcessibilidades(),
      ]);

      setResumo({
        tipos: tipos.length,
        subtipos: subtipos.length,
        barreiras: barreiras.length,
        acessibilidades: acessibilidades.length,
      });
    } catch (e: any) {
      setErro("Erro ao carregar resumo do admin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <div className="card">Carregando dashboard...</div>;
  }

  if (erro) {
    return <div className="card text-red-600">{erro}</div>;
  }

  if (!resumo) return null;

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div className="card py-8">
        <h2 className="text-xl font-bold mb-2">Painel do Administrador</h2>
        <p className="text-gray-600 text-sm">
          Gerencie os cadastros base do sistema: tipos, subtipos, barreiras e
          acessibilidades. Qualquer alteração aqui impacta diretamente a
          qualidade do match entre vagas e candidatos.
        </p>
      </div>

      {/* Cards de resumo */}
      <section className="grid gap-4 md:grid-cols-4">
        <Link to="/admin/tipos" className="card hover:shadow-md transition">
          <p className="text-xs text-slate-500 mb-1">Tipos de deficiência</p>
          <p className="text-2xl font-bold">{resumo.tipos}</p>
          <p className="mt-2 text-xs text-slate-500">
            Estrutura inicial da classificação.
          </p>
        </Link>

        <Link to="/admin/subtipos" className="card hover:shadow-md transition">
          <p className="text-xs text-slate-500 mb-1">Subtipos cadastrados</p>
          <p className="text-2xl font-bold">{resumo.subtipos}</p>
          <p className="mt-2 text-xs text-slate-500">
            Detalhamento dos perfis dos candidatos.
          </p>
        </Link>

        <Link to="/admin/barreiras" className="card hover:shadow-md transition">
          <p className="text-xs text-slate-500 mb-1">Barreiras</p>
          <p className="text-2xl font-bold">{resumo.barreiras}</p>
          <p className="mt-2 text-xs text-slate-500">
            Fatores que dificultam ou impedem a inclusão.
          </p>
        </Link>

        <Link
          to="/admin/acessibilidades"
          className="card hover:shadow-md transition"
        >
          <p className="text-xs text-slate-500 mb-1">Acessibilidades</p>
          <p className="text-2xl font-bold">{resumo.acessibilidades}</p>
          <p className="mt-2 text-xs text-slate-500">
            Recursos que mitigam ou eliminam barreiras.
          </p>
        </Link>
      </section>
    </div>
  );
}
