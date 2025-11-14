import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

type UserKind = "empresa" | "candidato" | "admin" | null;

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function LoginPage() {
  const [userKind, setUserKind] = useState<UserKind>(null);

  // Campos de formulário
  const [cnpj, setCnpj] = useState("");
  const [emailCandidato, setEmailCandidato] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const navigate = useNavigate();

  function validarCampos(): boolean {
    setErro(null);

    if (userKind === "empresa" && !cnpj.trim()) {
      setErro("Informe o CNPJ.");
      return false;
    }

    if (userKind === "candidato" && !emailCandidato.trim()) {
        setErro("Informe o e-mail.");
        return false;
    }

    if (userKind === "admin" && !usuario.trim()) {
      setErro("Informe o usuário do administrador.");
      return false;
    }

    if (!senha.trim()) {
      setErro("Informe a senha.");
      return false;
    }

    return true;
  }

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!validarCampos()) return;

    setLoading(true);
    try {
      if (userKind === "empresa") {
        const login = onlyDigits(cnpj);
        const resp = await api.authLogin("empresa", login, senha);
        setSucesso(`Bem-vindo(a), ${resp.user.nome}`);
        localStorage.setItem("session", JSON.stringify(resp));
        navigate(`/empresa/${resp.user.id}`);
        setCnpj("");
      } else if (userKind === "candidato") {
            const resp = await api.authLogin("candidato", emailCandidato.trim(), senha);
            setSucesso(`Bem-vindo(a), ${resp.user.nome}`);
            localStorage.setItem("session", JSON.stringify(resp));
            navigate(`/candidato/${resp.user.id}`);
            setEmailCandidato("");
      } else if (userKind === "admin") {
        const resp = await api.authLogin("admin", usuario.trim(), senha);
        setSucesso(`Bem-vindo(a), ${resp.user.nome}`);
        localStorage.setItem("session", JSON.stringify(resp));
        navigate(`/admin`);
        setUsuario("");
      }

      setSenha("");
    } catch (err: any) {
      setErro(err?.message ?? "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      
      <header className="text-center">
        {/* ======== CABEÇALHO ======== */}
        <div className="pb-5">
          <h1 className="text-2xl font-bold">Acessar conta</h1>
          <p className="text-gray-600">Escolha o tipo de acesso e entre no sistema.</p>
        </div>
        {/* ======== SELEÇÃO DO TIPO DE USUÁRIO ======== */}
        <div className="flex justify-center gap-4 flex-wrap">
        <button
          className={`btn ${userKind === "empresa" ? "btn-primary" : ""}`}
          onClick={() => setUserKind("empresa")}
        >
          Empresa
        </button>

        <button
          className={`btn ${userKind === "candidato" ? "btn-primary" : ""}`}
          onClick={() => setUserKind("candidato")}
        >
          Candidato
        </button>

        <button
          className={`btn ${userKind === "admin" ? "btn-primary" : ""}`}
          onClick={() => setUserKind("admin")}
        >
          Admin
        </button>
      </div>
      </header>
      
     

      {/* ======== FORMULÁRIOS ======== */}
      {userKind === "empresa" ? (
        <div className="card">
          <form onSubmit={fazerLogin} className="space-y-3">
            <div className="flex flex-col gap-3">
              <label className="label">CNPJ:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: 12.345.678/0001-90"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                disabled={loading}
              />

              <label className="label">Senha:</label>
              <input
                className="input border border-black p-1"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar como Empresa"}
              </button>
            </div>
          </form>
        </div>
      ) : userKind === "candidato" ? (
        <div className="card">
          <form onSubmit={fazerLogin} className="space-y-3">
            <div className="flex flex-col gap-3">
              <label className="label">E-mail:</label>
                <input
                className="input border border-black p-1"
                type="email"
                placeholder="ex.: usuario@exemplo.com"
                value={emailCandidato}
                onChange={(e) => setEmailCandidato(e.target.value)}
                disabled={loading}
                />

              <label className="label">Senha:</label>
              <input
                className="input border border-black p-1"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar como Candidato"}
              </button>
            </div>
          </form>
        </div>
      ) : userKind === "admin" ? (
        <div className="card">
          <form onSubmit={fazerLogin} className="space-y-3">
            <div className="flex flex-col gap-3">
              <label className="label">Usuário:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: admin01"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
              />

              <label className="label">Senha:</label>
              <input
                className="input border border-black p-1"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar como Admin"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card text-center">
          <p>
            Selecione o tipo de acesso: <strong>Empresa</strong>,{" "}
            <strong>Candidato</strong> ou <strong>Admin</strong>.
          </p>
        </div>
      )}
       {/* ======== FEEDBACKS ======== */}
      {erro && <div className="card text-red-600">{erro}</div>}
      {sucesso && <div className="card text-green-600">{sucesso}</div>}
      
    </div>
  );
}
