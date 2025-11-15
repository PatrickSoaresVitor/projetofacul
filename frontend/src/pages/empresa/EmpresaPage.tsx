import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
import { api } from "../../lib/api";
import type { Empresa } from "../../types";

export default function EmpresaPage() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setErro(null);
      try {
        if (!id) return;
        const data = await api.buscarEmpresa(Number(id));
        setEmpresa(data);
      } catch (err: any) {
        setErro("Erro ao carregar dados da empresa");
      }
    }
    carregar();
  }, [id]);

  if (erro) {
    return (
      <div className="container-page py-8 text-red-600">
        {erro}
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="container-page py-8">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topo agora com o mesmo “clima” colorido da Home/Login */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-page py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              <NavLink
                to={`/empresa/${empresa.id}`}
                className="hover:text-secondary-light"
              >
                {empresa.nome}
              </NavLink>
            </h1>

            {(empresa.cnpj || empresa.email) && (
              <p className="text-xs text-white/80 mt-1">
                {empresa.cnpj && <span>CNPJ: {empresa.cnpj}</span>}
                {empresa.cnpj && empresa.email && " • "}
                {empresa.email && <span>{empresa.email}</span>}
              </p>
            )}
          </div>

          <nav className="flex flex-wrap gap-2">
            <NavLink
              to={`/empresa/${empresa.id}`}
              end
              className={({ isActive }) =>
                [
                  "btn text-xs sm:text-sm",
                  isActive ? "btn-primary" : "bg-white/90 text-slate-700 border-transparent hover:bg-white",
                ].join(" ")
              }
            >
              Home
            </NavLink>
            <NavLink
              to={`/empresa/${empresa.id}/vagas`}
              className={({ isActive }) =>
                [
                  "btn text-xs sm:text-sm",
                  isActive ? "btn-primary" : "bg-white/90 text-slate-700 border-transparent hover:bg-white",
                ].join(" ")
              }
            >
              Minhas vagas
            </NavLink>

            <NavLink
              to={`/`}
              className="btn text-xs sm:text-sm bg-white/90 text-slate-700 border-transparent hover:bg-white"
            >
              SAIR
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Conteúdo interno (igual antes) */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
