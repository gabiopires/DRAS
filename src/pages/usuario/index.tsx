import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Alerta from "../../../components/alerta/Alerta";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Cadastrar() {

  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("Atendente");
  const [erroMensagem, setErroMensagem] = useState("");
  const [showAlerts,setshowAlerts]= useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  // valida o email
  const validarEmail = (email: string) => {
    const texto = email || "";
    setEmail(texto);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValido(regex.test(texto));
  };

  // formata o telefone
  const formatarTelefone = (telefone: string) => {
    const texto = telefone || "";
    let apenasNumeros = texto.replace(/\D/g, "");

    if (apenasNumeros.length > 11) {
      apenasNumeros = apenasNumeros.slice(0, 11);
    }

    let formatado = apenasNumeros;

    if (apenasNumeros.length <= 10) {
      formatado = apenasNumeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      formatado = apenasNumeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }

    setTelefone(formatado);
  };

  // envia os dados
  const cadastrarUsuario = async () => {
    setErroMensagem("");

    if (!emailValido) {
      setErroMensagem("Digite um e-mail válido.");
      return;
    }

    if (!nome || !email || !senha) {
      setErroMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const resposta = await fetch("/api/apiUsuario?action=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          endereco,
          senha,
          tipo,
        }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        setErroMensagem(data.message || "Erro ao cadastrar usuário.");
        return;
      }

      if (resposta.ok) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Cadastro realizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);router.push("/")}]
        }
      }
    } catch (error) {
      setErroMensagem("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="container">
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      {/* Lado esquerdo */}
      <div className="left">
        {/* <div className="circle-big"></div>
        <div className="circle-small"></div>
        <div className="circle-orange"></div> */}

        <div className="title-box">
          <h1 className="title">DRAS</h1>
          <p className="subtitle">automático</p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="right">
        <h2 className="login-title" style={{ textAlign: "center" }}>
          Cadastro
        </h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="input-group">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              background: "#f0f0f0",
              border: "none",
            }}
          >
            <option value="Administrador">Administrador</option>
            <option value="Atendente">Atendente</option>
          </select>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => formatarTelefone(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        {/* Campo email */}
        <div className="input-group">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => validarEmail(e.target.value)}
            style={{
              border: emailValido ? "none" : "2px solid red",
              background: emailValido ? "#f0f0f0" : "#ffe5e5",
            }}
          />
        </div>

        {!emailValido && (
          <p style={{ color: "red", marginTop: "-20px", marginBottom: "10px" }}>
            E-mail inválido
          </p>
        )}

        {/* Campo senha */}
        <div className="input-group" style={{ position: "relative" }}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ paddingRight: "40px" }}
          />

          <Image
            onClick={toggleMostrarSenha}
            alt="mostrar/esconder"
            height={50}
            width={50}
            src={"/images/eye_icon.svg"}
            style={{
              position: "absolute",
              right: "10px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Mensagens */}
        {erroMensagem && (
          <p style={{ color: "red", marginTop: "10px" }}>{erroMensagem}</p>
        )}

        <button className="btn-login" onClick={cadastrarUsuario}>
          Cadastrar
        </button>

        <p className="register-text">
          Já possui conta?{" "}
          <span onClick={() => router.push("/")}>Faça login</span>
        </p>
      </div>
    </div>
  );
}