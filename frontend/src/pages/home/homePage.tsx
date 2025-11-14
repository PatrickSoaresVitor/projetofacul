import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function HomePage() {
  const location = useLocation(); // pega a rota atual
  const path = location.pathname; // ex: "/home/create"
  const parts = path.split("/").filter(Boolean); // ["home","create"]
  const pageName = parts.length > 0 ? parts[parts.length - 1] : "home";

  const linkBase =
    "px-4 py-2 rounded-full text-sm font-semibold transition inline-flex items-center justify-center";
  const inactive =
    "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white";
  const active = "bg-white text-primary shadow-sm";

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white shadow">
        <div className="container-page py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Branding */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Portal de Oportunidades PCD
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-xl">
              Conectando pessoas com deficiência a empresas realmente
              comprometidas com inclusão e acessibilidade.
            </p>
          </div>

          {/* Navegação principal (HOME / LOGIN / CREATE) */}
          <nav className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
            <NavLink
              to="/home"
              end
              className={
                linkBase + " " + (pageName === "home" ? active : inactive)
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/home/login"
              className={
                linkBase + " " + (pageName === "login" ? active : inactive)
              }
            >
              LOGIN
            </NavLink>

            <NavLink
              to="/home/create"
              className={
                linkBase + " " + (pageName === "create" ? active : inactive)
              }
            >
              CREATE
            </NavLink>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO DAS ROTAS FILHAS */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
