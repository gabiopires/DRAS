import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Alerta from "../../../components/alerta/Alerta";
import Menu from "../../../components/menu/Menu";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Login() {
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showAlerts,setshowAlerts]= useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);
  const router = useRouter();

  async function redefinirSenha() {
    try {
      const resp = await fetch(`/api/apiPrimeiroAcesso`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senha: senha,
          email: email,
        }),
      });

      if(resp.status === 200) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Senha redefinida com sucesso! Faça login para acessar o sistema.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false); router.push("/");}]
        }
      }else if(resp.status === 400){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "E-mail incorreto. Verifique o e-mail digitado e tente novamente.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao redefinir senha. Tente novamente mais tarde.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false); router.push("/");}]
        }
      }
    } catch (error) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro ao redefinir senha. Tente novamente mais tarde.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false); router.push("/");}]
      }
    }
  }

  function verificarSenhasIguais() {
    if (senha !== confirmaSenha) {
      setshowAlerts(true)   
      dataAlerts = {
        alertText: "As senhas não coincidem. Por favor, verifique e tente novamente.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }   
    } else {
      redefinirSenha();
    }
  }

  return (
    <div className="primeiroAcesso">
      <Menu page={5}/>
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <div className="cardPrimeiroAcesso">
        <div className="boxRedefinirSenha">
          <div className="boxRedefinirSenha_title">
            <h2>Olá, seja bem vindo(a)!</h2>
            <p>Para acessar o sistema, é necessário redefinir sua senha.</p>
          </div>
          <div className="boxRedefinirSenha_inputs">
            <p>Digite seu email de acesso ao sistema</p>
            <div>
              <input className="inputEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <p>Digite sua nova senha</p>
            <div>
              <input className="inputSenha" type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)}/>
              <Image alt="" width={35} height={35} src={mostrarSenha ? './images/eye_icon.svg' : './images/eye_closed.svg'} onClick={()=>{setMostrarSenha(!mostrarSenha)}}/>
            </div>
            <p>Confirme sua nova senha</p>
            <div>
              <input className="inputConfirmaSenha" type={mostrarConfirmaSenha ? "text" : "password"} value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)}/>
              <Image alt="" width={35} height={35} src={mostrarConfirmaSenha ? './images/eye_icon.svg' : './images/eye_closed.svg'} onClick={()=>{setMostrarConfirmaSenha(!mostrarConfirmaSenha)}}/>
            </div>
          </div>
          <button className="buttonRedefinirSenha" onClick={() => verificarSenhasIguais()}>Redefinir Senha</button>
        </div>
      </div>
    </div>
  );
}