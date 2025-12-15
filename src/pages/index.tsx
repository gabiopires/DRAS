import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Alerta from "../../components/alerta/Alerta";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showAlerts,setshowAlerts]= useState(false);
  const router = useRouter();

  const [mostrar, setMostrar] = useState(false);
  const toggleMostrar = () => setMostrar(!mostrar);

  // Função de login
  const LoginUser = async () => {
    if (!email || !senha) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Preencha usuário e senha!",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
      return;
    }

    try {
      const endpoint = `/api/apiLogin?action=login&email=${email}&senha=${senha}`;

      const response = await fetch(endpoint, {
        method: "GET",
      });

      const data = await response.json();

      if (response.status === 200) {
        // SALVAR ID DO USUÁRIO LOGADO
        localStorage.setItem("userId", data.usuario.id);
        localStorage.setItem("permissão", data.usuario.tipo);
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Login realizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);router.push("/cadastros")}]
        }
      } 
      else if (response.status === 401) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "E-mail ou senha incorretos!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      } 
      else {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor. Tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    } catch (error) {
      console.log(error);
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro inesperado no servidor. Tente novamente mais tarde",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
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
        <h2 className="login-title">Login</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group" style={{ position: "relative" }}>
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
            style={{
              position: "absolute",
              right: "10px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          />
        </div>

        <button onClick={LoginUser} className="btn-login">
          Entrar
        </button>

        <p
          className="register-text"
          onClick={() => router.push("/usuario")}
        >
          Não é cadastrado? <span>Cadastre-se aqui</span>
        </p>
      </div>
    </div>
  );
}
