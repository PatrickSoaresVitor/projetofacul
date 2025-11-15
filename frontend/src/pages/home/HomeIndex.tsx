// src/pages/home/HomeIndex.tsx
import { Link } from "react-router-dom";

export default function HomeIndex() {
  return (
    <div className="space-y-10">
      {/* HERO / APRESENTAÇÃO */}
      <section className="card py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Bem-vindo ao Portal de Oportunidades PCD
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Nosso objetivo é aproximar pessoas com deficiência de empresas que levam
          inclusão a sério, utilizando subtipos, barreiras e acessibilidades para
          encontrar as vagas realmente compatíveis com cada perfil.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/home/login"
            className="btn btn-primary text-sm px-6"
          >
            Já tenho conta
          </Link>
          <Link
            to="/home/create"
            className="btn border border-primary/40 bg-white text-primary text-sm px-6"
          >
            Criar conta
          </Link>
        </div>
      </section>

      {/* PÚBLICOS: CANDIDATO x EMPRESA */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Sou candidato PCD</h3>
          <p className="text-sm text-slate-600 mb-3">
            Cadastre seu perfil, informe suas deficiências, subtipos e barreiras
            enfrentadas. A partir disso, o portal sugere vagas que respeitam
            suas necessidades de acessibilidade.
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Cadastro simples com CPF, nome e contato.</li>
            <li>Configuração de subtipos e barreiras no painel do candidato.</li>
            <li>Visualização de vagas compatíveis e candidatura em poucos cliques.</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Sou empresa</h3>
          <p className="text-sm text-slate-600 mb-3">
            Cadastre sua empresa, abra vagas e indique quais perfis são aceitos
            e quais recursos de acessibilidade você oferece no ambiente de trabalho.
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Cadastro com CNPJ e dados básicos da organização.</li>
            <li>Criação de vagas com escolaridade, subtipos aceitos e acessibilidades.</li>
            <li>Visão geral das candidaturas recebidas por vaga.</li>
          </ul>
        </div>
      </section>

      {/* COMO FUNCIONA NA PRÁTICA */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Como o portal funciona na prática
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-lg p-3 bg-slate-50">
            <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
              1. Cadastro estruturado
            </p>
            <p className="text-sm text-slate-600">
              Candidatos e empresas se cadastram e informam seus dados com base
              em tipos de deficiência, subtipos, barreiras e acessibilidades.
            </p>
          </div>

          <div className="border rounded-lg p-3 bg-slate-50">
            <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
              2. Mapeamento de barreiras
            </p>
            <p className="text-sm text-slate-600">
              O sistema cruza as barreiras enfrentadas pelos candidatos com os
              recursos de acessibilidade oferecidos pelas empresas.
            </p>
          </div>

          <div className="border rounded-lg p-3 bg-slate-50">
            <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
              3. Vagas compatíveis
            </p>
            <p className="text-sm text-slate-600">
              O candidato passa a enxergar apenas vagas compatíveis com seu
              contexto, e a empresa recebe candidaturas mais aderentes à realidade do posto.
            </p>
          </div>
        </div>

        
      </section>
    </div>
  );
}
