import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Alerta from "../../components/alerta/Alerta";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const router = useRouter();

  // Novo estado agrupado para gerenciar os alertas de forma limpa e nativa do React
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    text: "",
    buttons: [""],
    commands: [() => {}],
  });

  const toggleMostrar = () => setMostrar(!mostrar);

  // Função auxiliar para fechar o alerta
  const fecharAlerta = () => setAlertConfig({ ...alertConfig, show: false });

  // Função de login
  const LoginUser = async () => {
    if (!email || !senha) {
      setAlertConfig({
        show: true,
        text: "Preencha usuário e senha!",
        buttons: ["Ok"],
        commands: [fecharAlerta],
      });
      return;
    }

    try {
      // O endpoint agora é limpo, sem expor os dados na URL
      const endpoint = `/api/apiLogin`; // Ajuste para o nome exato do seu arquivo de rota

      const response = await fetch(endpoint, {
        method: "POST", // Mudamos para POST
        headers: {
          "Content-Type": "application/json", // Avisa a API que estamos enviando JSON
        },
        body: JSON.stringify({ email, senha }), // Os dados vão escondidos e seguros no body
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push("/cadastrar");
      }else if (response.status === 403 && data.novoUsuario === true) {
        router.push("/primeiroAcesso");
      }else if (response.status === 401) {
        setAlertConfig({
          show: true,
          text: data.message || "E-mail ou senha incorretos!",
          buttons: ["Ok"],
          commands: [fecharAlerta],
        });
      } 
      else {
        setAlertConfig({
          show: true,
          text: "Erro inesperado no servidor. Tente novamente mais tarde.",
          buttons: ["Ok"],
          commands: [fecharAlerta],
        });
      }
    } catch (error) {
      console.error(error);
      setAlertConfig({
        show: true,
        text: "Erro inesperado ao conectar com o servidor.",
        buttons: ["Ok"],
        commands: [fecharAlerta],
      });
    }
  };

  return (
    <div className="containerLogin">
      {/* Passando as props corretamente para o componente de Alerta */}
      {alertConfig.show && (
        <Alerta 
          dataAlert={{
            alertText: alertConfig.text,
            alertButtons: alertConfig.buttons,
            alertsCommans: alertConfig.commands
          }} 
        />
      )}

      {/* Lado esquerdo */}
      <div className="left">
        <div className="title-box">
          <h1 className="title">DRAS</h1>
          <h2 className="subtitle" style={{ color: '#fff' }}>Login</h2>
        </div>
      </div>

      {/* Lado direito */}
      <div className="right">
        <div className="right-text-box">
          <p>Informe seu e-mail e sua senha. Caso não tenha cadastro procure</p>
          <p>um administrador do sistema</p>
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type={mostrar ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ paddingRight: "40px" }}
          />
          <Image
            onClick={toggleMostrar}
            alt="mostrar/esconder"
            height={50}
            width={50}
            src="./images/eye_icon.svg"
            style={{ cursor: "pointer" }}
          />
        </div>
        <button onClick={LoginUser} className="btn-login">
          Entrar
        </button>
      </div>
    </div>
  );
}