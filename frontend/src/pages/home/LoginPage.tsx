import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

type UserKind = "empresa" | "candidato" | "admin" | null;


export default function LoginPage() {

  // Campos de formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const navigate = useNavigate();

  function validarCampos(): boolean {
    setErro(null);

    if (!email.trim()) {
      setErro("Informe o e-mail.");
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
      const resp = await api.authLogin(email.trim(), senha);
      const { role, user } = resp;
      const userKind = role as UserKind; 
      setSucesso(`Bem-vindo(a), ${user.nome}`);
      localStorage.setItem("session", JSON.stringify(resp));

      if (userKind === "empresa") {
        navigate(`/empresa/${user.id}`);
      } else if (userKind === "candidato") {
        navigate(`/candidato/${user.id}`);
      } else if (userKind === "admin") {
        navigate(`/admin`);
      } else {
        // fallback defensivo caso venha algo inesperado
        setErro("Tipo de usuário inválido retornado pelo servidor.");
      }
      setEmail("");
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
          <p className="text-gray-600">Faça login com seu e-mail e senha para acessar o portal.</p>
        </div>
      </header>

        {/* ======== FORMULÁRIO ÚNICO ======== */}
      <div className="card max-w-md mx-auto">
        <form onSubmit={fazerLogin} className="space-y-3">
          <div className="flex flex-col gap-3">
            <label className="label">E-mail:</label>
            <input
              className="input border border-black p-1"
              type="email"
              placeholder="ex.: usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
       {/* ======== FEEDBACKS ======== */}
      {erro && <div className="card text-red-600">{erro}</div>}
      {sucesso && <div className="card text-green-600">{sucesso}</div>}
      
    </div>
  );
}
