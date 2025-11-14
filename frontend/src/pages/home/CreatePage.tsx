import { useState } from "react";
import { api } from "../../lib/api";

type UserKind = "empresa" | "candidato" | null;

export default function CreatePage() {
  const [userKind, setUserKind] = useState<UserKind>(null);

  // ===== CAMPOS EMPRESA =====
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");

  // ===== CAMPOS CANDIDATO =====
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [nascimento, setNascimento] = useState("");

  // ===== CAMPOS COMUNS =====
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");

  // ===== ESTADOS DE CONTROLE =====
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // ======= VALIDAÇÃO =======
  function validarCampos(): boolean {
    setErro(null);

    if (userKind === "empresa") {
      if (!razaoSocial.trim()) {
        setErro("Informe a razão social.");
        return false;
      }
      if (!cnpj.trim()) {
        setErro("Informe o CNPJ.");
        return false;
      }
        if (!email.trim()) {
        setErro("Informe o email.");
        return false;
      }
      if (!senha.trim()) {
        setErro("Informe a senha.");
        return false;
      }
      if (!senhaConfirm.trim()) {
        setErro("Confirme a senha.");
        return false;
      }
    }

    if (userKind === "candidato") {
      if (!cpf.trim()) {
        setErro("Informe o CPF.");
        return false;
      }
      if (!nome.trim()) {
        setErro("Informe o nome.");
        return false;
      }
      if (!sobrenome.trim()) {
        setErro("Informe o sobrenome.");
        return false;
      }
      if (!nascimento.trim()) {
        setErro("Informe a data de nascimento.");
        return false;
      }
      if (!email.trim()) {
        setErro("Informe o email.");
        return false;
      }
      if (!senha.trim()) {
        setErro("Informe a senha.");
        return false;
      }
      if (!senhaConfirm.trim()) {
        setErro("Confirme a senha.");
        return false;
      }
    }

    if (userKind === "candidato") {
      if (!cpf.trim()) {
        setErro("Informe o CPF.");
        return false;
      }
      if (!nome.trim()) {
        setErro("Informe o nome.");
        return false;
      }
      if (!sobrenome.trim()) {
        setErro("Informe o sobrenome.");
        return false;
      }
      if (!nascimento.trim()) {
        setErro("Informe a data de nascimento.");
        return false;
      }
    }

    if (!senha || !senhaConfirm) {
      setErro("Informe e confirme a senha.");
      return false;
    }

    if (senha !== senhaConfirm) {
      setErro("As senhas não conferem.");
      return false;
    }

    return true;
  }

  // ======= “CADASTRO” =======
  async function cadastrar(e: React.FormEvent) {
  e.preventDefault();
  setErro(null);
  setSucesso(null);

  if (!validarCampos()) return;

  setLoading(true);
  try {
    if (userKind === "empresa") {
      await api.criarEmpresa(razaoSocial.trim(), cnpj, email.trim(), senha);
      setSucesso(`Empresa "${razaoSocial}" cadastrada com sucesso!`);
      setRazaoSocial("");
      setCnpj("");
    } else if (userKind === "candidato") {
      const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`.trim();
      await api.criarCandidato(nomeCompleto, email.trim(), senha, "Não informado", cpf);
      setSucesso(`Candidato "${nomeCompleto}" cadastrado com sucesso!`);
      setCpf(""); // limpa o CPF
      setNome("");
      setSobrenome("");
      setNascimento("");
    }
    
    setEmail("");
    setSenha("");
    setSenhaConfirm("");
  } catch (err: any) {
    setErro(err?.message ?? "Falha ao cadastrar.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="container-page space-y-6 py-8">
      {/* ======== SELEÇÃO DO TIPO DE USUÁRIO ======== */}
      

      {/* ======== CABEÇALHO ======== */}
      <header className="text-center">
        <div className="pb-5">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-gray-600">Cadastre sua conta caso ainda não tenha uma.</p>
        </div>
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
      </div>
      </header>

      

      {/* ======== FORMULÁRIOS ======== */}
      {userKind === "empresa" ? (
        <div className="card">
          <form onSubmit={cadastrar} className="space-y-3">
            <div className="flex flex-col gap-3">
              <label className="label">Razão Social:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: Solidez Borrachas LTDA"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                disabled={loading}
              />

              <label className="label">CNPJ:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: 12.345.678/0001-90"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                disabled={loading}
              />
              <label className="label">E-mail:</label>
                <input
                className="input border border-black p-1"
                type="email"
                placeholder="ex.: empresa@exemplo.com"
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

              <label className="label">Confirme a senha:</label>
              <input
                className="input border border-black p-1"
                type="password"
                placeholder="Confirme sua senha"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Salvando..." : "Criar conta (Empresa)"}
              </button>
            </div>
          </form>
        </div>
      ) : userKind === "candidato" ? (
        <div className="card">
          <form onSubmit={cadastrar} className="space-y-3">
            <div className="flex flex-col gap-3">
              <label className="label">CPF:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: 123.456.789-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                disabled={loading}
              />

              <label className="label">Nome:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: João"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
              />

              <label className="label">Sobrenome:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: da Silva"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                disabled={loading}
              />

              <label className="label">Nascimento:</label>
              <input
                className="input border border-black p-1"
                placeholder="ex.: 01/01/2000"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                disabled={loading}
              />

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

              <label className="label">Confirme a senha:</label>
              <input
                className="input border border-black p-1"
                type="password"
                placeholder="Confirme sua senha"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Salvando..." : "Criar conta (Candidato)"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card text-center">
          <p>
            Selecione se você é <strong>Empresa</strong> ou{" "}
            <strong>Candidato</strong> para criar sua conta.
          </p>
        </div>
      )}
      
      {/* ======== FEEDBACKS ======== */}
      {erro && <div className="card text-red-600">{erro}</div>}
      {sucesso && <div className="card text-green-600">{sucesso}</div>}
    </div>
  );
}
