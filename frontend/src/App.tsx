import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";

// já existentes
import TiposPage from "./pages/TiposPage";
import SubtiposPage from "./pages/SubtiposPage";
import BarreirasPage from "./pages/BarreirasPage";
import AcessibilidadesPage from "./pages/AcessibilidadesPage";
import EmpresaPage from "./pages/empresa/EmpresaPage";
import VagaPage from "./pages/empresa/VagaPage";
import VagaDetalhePage from "./pages/empresa/VagaDetalhePage";
import CandidatoPage from "./pages/candidato/CandidatoPage";
import HomePage from "./pages/home/homePage";
import CreatePage from "./pages/home/CreatePage";
import LoginPage from "./pages/home/LoginPage";
import CandidatoVagasPage from "./pages/candidato/CandidatoVagasPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona raiz para /admin */}
        <Route path="/" element={<Navigate to="/home" replace />} />

      
        <Route path="/home" element={<HomePage />}>
          <Route path="create" element={<CreatePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Área admin com layout e rotas filhas */}
        <Route path="/admin" element={<AdminPage />}>
          <Route path="tipos" element={<TiposPage />} />
          <Route path="subtipos" element={<SubtiposPage />} />
          <Route path="barreiras" element={<BarreirasPage />} />
          <Route path="acessibilidades" element={<AcessibilidadesPage />} />
        </Route>

        {/* Área da empresa com layout e rotas filhas */}
        <Route path="/empresa/:id" element={<EmpresaPage />}>
          <Route path="vagas" element={<VagaPage />} />
          <Route path="vagas/:vagaId" element={<VagaDetalhePage />} />
        </Route>

       {/* Área do candidato */}
        <Route path="/candidato/:id" element={<CandidatoPage />} />
        <Route path="/candidato/:id/vagas" element={<CandidatoVagasPage />} />

        {/* 404 simples */}
        <Route path="*" element={<div className="container-page py-8">Página não encontrada.</div>} />
      </Routes>
    </BrowserRouter>
  );
}