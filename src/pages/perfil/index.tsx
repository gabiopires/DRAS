import Menu from "../../../components/menu/Menu";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Alerta from "../../../components/alerta/Alerta";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [tipo, setTipo] = useState("");
  const [viewPerfil,setViewPerfil]= useState(true);
  const [showAlerts,setshowAlerts]= useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{
    carregarPerfil();
  },[])

  async function carregarPerfil() {
    try {
      const resp = await fetch(`/api/apiPerfil`);
      const data = await resp.json();

      if(resp.status === 200 && data.user) {
        setNome(data.user.Nome);
        setTelefone(data.user.Telefone);
        setEndereco(data.user.Endereco);
        setEmail(data.user.Email);
        setSenha(data.user.Senha);
        setTipo(data.user.Tipo);
        setViewPerfil(true);
      }else if(resp.status === 404){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Usuário não encontrado",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao carregar perfil",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    }
  }

  // salvar dados atualizados
  const salvarAlteracoes = async () => {
    try {
      const resp = await fetch(`/api/apiPerfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          endereco,
          email,
          senha,
        }),
      });

      if(resp.status === 200) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Perfil atualizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao atualizar perfil. Tente novamente mais tarde.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    } catch (error) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro ao atualizar perfil. Tente novamente mais tarde.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
  };

  // BOTÃO EDITAR / SALVAR
  const handleBotao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editando) {
      await salvarAlteracoes();
    }

    setEditando(!editando);
  };

   // BOTÃO CADASTRAR NOVO
  const handleBotaoNovo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editando) {
      await salvarAlteracoes();
    }

    setEditando(!editando);
  };

  // Focar no primeiro campo ao ativar edição
  useEffect(() => {
    if (editando && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [editando]);

  // Mostrar/esconder senha
  const [mostrar, setMostrar] = useState(false);
  const toggleMostrar = () => setMostrar(!mostrar);

  return (
    <div>
      <Menu page={5} />
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <div className="perfilWrapper">
        {tipo == 'Administrador' ?
          <div className="togglePerfil">
            <div className="togglePerfil_perfil" onClick={()=>{setViewPerfil(true)}}>Meu Perfil</div>
            <div className="togglePerfil_cadastrar" onClick={()=>{setViewPerfil(false)}}>Cadastrar Novo Perfil</div>
            <div className="togglePerfil_cadastrar" onClick={()=>{setViewPerfil(false)}}>Visualizar Perfis</div>
          </div> : " "
        }
        <div className="perfilCard">
          {viewPerfil ? <>
            <div className="perfilIconWrap">
              <Image
                src="/images/account_circle_orange.svg"
                alt="perfil"
                width={110}
                height={110}
              />
            </div>
            <form className="perfilForm" onSubmit={handleBotao}>
              <div className="perfilRow">
                <div className="perfilField">
                  <label className="perfilLabel">Nome</label>
                  <input
                    ref={firstInputRef}
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    value={nome}
                    disabled={!editando}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="perfilField">
                  <label className="perfilLabel">Telefone</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    value={telefone}
                    disabled={!editando}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>
              <div className="perfilRowSingle">
                <div className="perfilFieldFull">
                  <label className="perfilLabel">Endereço</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    value={endereco}
                    disabled={!editando}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>
              </div>
              <div className="perfilRow">
                <div className="perfilField">
                  <label className="perfilLabel">E-mail</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    value={email}
                    disabled={!editando}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="perfilField" style={{ position: "relative" }}>
                  <label className="perfilLabel">Senha</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    value={senha}
                    disabled={!editando}
                    onChange={(e) => setSenha(e.target.value)}
                    type={mostrar ? "text" : "password"}
                  />
                  <Image
                    onClick={toggleMostrar}
                    alt="mostrar/esconder"
                    height={40}
                    width={40}
                    src="/images/eye_icon.svg"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "35%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
              <div className="perfilButtonRow">
                <button type="submit" className="perfilEditButton">
                  {editando ? "Salvar" : "Editar"}
                </button>
              </div>
            </form></> :
          <>
            <form className="perfilNovoForm" onSubmit={handleBotaoNovo}>
              
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">Nome</label>
                  <input
                    ref={firstInputRef}
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">Telefone</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="perfilRowSingle">
                <div className="perfilFieldFull">
                  <label className="perfilLabel">Endereço</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">E-mail</label>
                  <input
                    className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
              </div>
                
              <div className="perfilButtonRow">
                <button type="submit" className="perfilEditButton">
                  Criar
                </button>
              </div>
            </form>
          </>}
        </div>
      </div>
    </div>
  );
}
