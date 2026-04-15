import Menu from "../../../components/menu/Menu";
import React, { useState, useRef, useEffect } from "react";
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
  const [senhaAnterior, setSenhaAnterior] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [tipo, setTipo] = useState("");
  const [viewPerfil,setViewPerfil]= useState("perfil");
  const [showAlerts,setshowAlerts]= useState(false);
  const [HabilitarEditarSenha, setHabilitarEditarSenha] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const [novoUsuario, setNovoUsuario] = useState({ nome: "", telefone: "", endereco: "", email: ""});

  useEffect(()=>{
    carregarPerfil();
    if (editando && firstInputRef.current) {
      firstInputRef.current.focus();
    }
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
        setViewPerfil("perfil");
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

  const mudarAba = (novaAba: string) => {
    setViewPerfil(novaAba);
    setEditando(false); 

    if (novaAba === "todosPerfis") {
      // Busca os dados dos perfis
      carregarTodosPerfil(); 
    }
  };

  async function carregarTodosPerfil() {

  }

  async function cadastrarPerfi() {
    try {
      const resp = await fetch(`/api/apiPerfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoUsuario.nome,
          telefone: novoUsuario.telefone,
          endereco: novoUsuario.endereco,
          email: novoUsuario.email,
        }),
      });

      if(resp.status === 201) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Perfil cadastrado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
        }
      }else if(resp.status === 400){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "E-mail informado já está em uso. Informe outro e-mail.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao cadastrar perfil. Tente novamente mais tarde.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
        }
      }
    } catch (error) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro ao cadastrar perfil. Tente novamente mais tarde.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
      }
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
          senhaAnterior,
          novaSenha
        }),
      });

      if(resp.status === 200) {
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Perfil atualizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
        }
      }else if(resp.status === 400){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Senha atual incorreta. Nenhum dado foi atualizado.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao atualizar perfil. Tente novamente mais tarde.",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
        }
      }
    } catch (error) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro ao atualizar perfil. Tente novamente mais tarde.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false);window.location.reload();}]
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

    await cadastrarPerfi();

  };

  function editarSenha() {
    setHabilitarEditarSenha(true);
  }

  return (
    <div>
      <Menu page={5} />
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <div className="perfilWrapper">
        {tipo == 'Administrador' ?
          <div className="togglePerfil">
            <div className="togglePerfil_perfil" onClick={() => mudarAba("perfil")}>Meu Perfil</div>
            <div className="togglePerfil_cadastrar" onClick={() => mudarAba("cadastrar")}>Cadastrar Novo Perfil</div>
            <div className="togglePerfil_cadastrar" onClick={()=>{mudarAba("todosPerfis")}}>Visualizar Perfis</div>
          </div> : " "
        }
        <div className="perfilCard">
          {viewPerfil === "perfil" ? 
          <>
            <form className="perfilForm" onSubmit={handleBotao}>
              <div className="perfilRow">
                <div className="perfilField">
                  <label className="perfilLabel">Nome</label>
                  <input ref={firstInputRef} className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={nome} disabled={!editando} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="perfilField">
                  <label className="perfilLabel">Telefone</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={telefone} disabled={!editando} onChange={(e) => setTelefone(e.target.value)} />
                </div>
              </div>
              <div className="perfilRowSingle">
                <div className="perfilFieldFull">
                  <label className="perfilLabel">Endereço</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={endereco} disabled={!editando}  onChange={(e) => setEndereco(e.target.value)} />
                </div>
              </div>
              <div className="perfilRow">
                <div className="perfilField">
                  <label className="perfilLabel">E-mail</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={email} disabled={!editando}  onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
                {editando == false ? <div className="perfilField" style={{ position: "relative" }}>
                  <label className="perfilLabel">Senha</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={senha} type={"password"} />
                </div>: ""}
              </div>
              {HabilitarEditarSenha && <div className="perfilRow">
                <div className="perfilField">
                  <label className="perfilLabel">Digite sua senha atual</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={senhaAnterior} onChange={(e)=> setSenhaAnterior(e.target.value)}/>
                </div>
                <div className="perfilField" style={{ position: "relative" }}>
                  <label className="perfilLabel">Digite a nova senha</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={novaSenha} onChange={(e)=> setNovaSenha(e.target.value)}/>
                </div>
              </div>}
              <div className="perfilButtonRow">
                <button type="submit" className="perfilEditButton">
                  {editando ? "Salvar" : "Editar"}
                </button>
                {editando && (
                  <>
                    {HabilitarEditarSenha == false ? 
                      <button className="perfilEditButton" type="button" onClick={()=>{editarSenha()}}>
                        Editar Senha
                      </button>
                      :
                      <button className="perfilEditButton" type="button" onClick={()=>{setEditando(false); setHabilitarEditarSenha(false); setNovaSenha(""); setSenhaAnterior("")}}>
                        Cancelar
                      </button>
                      }
                  </>
                )}
              </div>
            </form></> : viewPerfil === "cadastrar" ?
          <>
            <form className="perfilNovoForm" onSubmit={handleBotaoNovo}>
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">Nome</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={novoUsuario.nome}  onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                </div>
              </div>
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">Telefone</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={novoUsuario.telefone}  onChange={(e) => setNovoUsuario({...novoUsuario, telefone: e.target.value})} />
                </div>
              </div>
              <div className="perfilRowSingle">
                <div className="perfilFieldFull">
                  <label className="perfilLabel">Endereço</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={novoUsuario.endereco}  onChange={(e) => setNovoUsuario({...novoUsuario, endereco: e.target.value})} />
                </div>
              </div>
              <div className="perfilRowSingle">
                <div className="perfilField">
                  <label className="perfilLabel">E-mail</label>
                  <input className={`perfilInput ${editando ? "perfilInputAtivo" : ""}`} value={novoUsuario.email}  onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})} />
                </div>
              </div>
              <div className="perfilButtonRow">
                <button type="submit" className="perfilEditButton">
                  Cadastrar
                </button>
              </div>
            </form>
          </> :
          <>

          </>
          }
        </div>
      </div>
    </div>
  );
}
