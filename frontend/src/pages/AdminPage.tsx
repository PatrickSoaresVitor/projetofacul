import { NavLink, Outlet } from "react-router-dom";

export default function AdminPage() {
  const linkBase =
    "px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition";
  const linkInactive =
    "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white";
  const linkActive = "bg-white text-primary shadow-sm";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topbar no mesmo padrão do restante (gradient azul/verde) */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white shadow">
        <div className="container-page py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">
            <NavLink
              to="/admin"
            >
              Administração
            </NavLink></h1>

          <nav className="flex gap-2 flex-wrap">
            <NavLink
              to="/admin/tipos"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Tipos
            </NavLink>

            <NavLink
              to="/admin/subtipos"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Subtipos
            </NavLink>

            <NavLink
              to="/admin/barreiras"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Barreiras
            </NavLink>

            <NavLink
              to="/admin/acessibilidades"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Acessibilidades
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              SAIR
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Conteúdo das rotas filhas */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
