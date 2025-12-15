import { TypePessoa } from "../../../components/type";
import { useState, useEffect } from "react";
import Alerta from "../../../components/alerta/Alerta";
interface Props {
  pessoa: TypePessoa;
  onClose: () => void;
}

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function CadastroIndividual({ pessoa, onClose }: Props) {

  const [edit, setEdit] = useState(false);
  const [nome, setNome] = useState(pessoa.nome);
  const [referenciaFamiliar, setReferenciaFamiliar] = useState(pessoa.referenciaFamiliar);
  const [endereco, setEndereco] = useState(pessoa.endereco);
  const [identificacao, setIdentificacao] = useState(pessoa.identificacao);
  const [territorioId, setTerritorioId] = useState(pessoa.idTerritorio);
  const [centroSaude, setCentroSaude] = useState(pessoa.centroSaude);
  const [sexo, setSexo] = useState(pessoa.sexo);
  const [deficiencia, setDeficiencia] = useState(pessoa.deficiencia);
  const [situacaoRua, setSituacaoRua] = useState(pessoa.situacaoRua);
  const [categoriaId, setCategoriaId] = useState(pessoa.idCategoria);
  const [tecnicoId, setTecnicoId] = useState(pessoa.idTecnicoResponsavel);
  const [acolhimento, setAcolhimento] = useState(pessoa.acolhimentoInstitucional);
  const [orgaoEncaminhador, setOrgaoEncaminhador] = useState(pessoa.orgaoEncaminhador);
  const [referencia, setReferencia] = useState(pessoa.referencia);
  const [idVulnerabilidade, setIdVulnerabilidade] = useState(pessoa.idVulnerabilidade);
  const [idViolacao, setIdViolacao] = useState(pessoa.idViolacao);
  const [idEncaminhamento, setIdEncaminhamento] = useState(pessoa.idEncaminhamento);
  const [sigps, setSigps] = useState(pessoa.sigps);
  const [dilacao, setDilacao] = useState(pessoa.dilacao)
  const [dataDilacao, setDataDilacao] = useState(pessoa.dataDilacao)
  const [dataCategorias, setDataCategorias] = useState<{id: string; descricao: string}[]>([]);
  const [dataVulnerabilidade, setDataVulnerabilidade] = useState<{id: string, descricao: string}[]>([]);
  const [dataViolacao, setDataViolacao] = useState<{id: string, descricao: string}[]>([]);
  const [dataTecnico, setDataTecnico] = useState<{id: string, nome: string}[]>([]);
  const [dataTerritorios, setDataTerritorio] = useState<{id: string, descricao: string}[]>([]);
  const [dataEncaminhamento, setDataEncaminhamento] = useState<{id: string, descricao: string}[]>([]);
  const [permissao, setPermissao] = useState<string>("");
  const [showAlerts,setshowAlerts]= useState(false);

  useEffect(()=>{
    initData();
    const perm = localStorage.getItem("permissão");
    if(perm){
      setPermissao(perm)
    }
  },[]);

  const initData = async () =>{
    try{
      const endpont = `/api/apiCadastrar?action=getInitData`;
      const response=await fetch(endpont,{method: "GET", cache:"reload"})
      const data = await response.json();
      if(response.status === 200){
        setDataCategorias(data.categorias)
        setDataTerritorio(data.territorios)
        setDataVulnerabilidade(data.vulnerabilidades)
        setDataTecnico(data.tecnicoResponsavel)
        setDataViolacao(data.violacao)
        setDataEncaminhamento(data.encaminhamento);
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro ao carregar dados, tente novamente mais tarde!",
          alertButtons: ["Editar"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }
    }catch(error){
      console.log(error)
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Erro inesperado no servidor, tente novamente mais tarde",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false);onClose()}]
      }
    }
  }

  function saveEdit(){
    if(edit){
      handleAddNew()
    }else{
      setEdit(!edit);
    }
  }

  const handleAddNew = () =>{
    if(nome == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um nome",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(territorioId == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione um territorio",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(sexo == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione um sexo",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(identificacao == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite uma identificação. Caso o paciente não possua, escreva: Sem identificação",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(endereco == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um endereço",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(referenciaFamiliar == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite uma referência familiar. Caso o paciente não possua, escreva: Sem referência familiar",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(centroSaude == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um centro de saúde",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(deficiencia == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione se o paciente possui deficiencia ou não",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(situacaoRua == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione se o paciente está em situação de rua ou não",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      } 
    }else if(categoriaId == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione uma categoria",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(tecnicoId == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione um tecnico responsavel",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      } 
    }else if(acolhimento == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um acolhimento institucional. Caso não possua, digite: Sem acolhimento institucional",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(orgaoEncaminhador == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um orgão encaminhador. Caso não possua, digite: Sem orgão encaminhador",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(referencia == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite uma referência. Caso não possua, digite: Sem referência",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(idVulnerabilidade == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione uma vulnerabilidade",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(idViolacao == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione uma violação",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(idEncaminhamento == undefined){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione um encaminhamento.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(sigps == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um SIGPS. Caso não possua, digite: Sem SIGPS",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else{
      setEdit(!edit);
      saveEditData()
    }
  }

  async function saveEditData(){
    try{
      const endpont = `/api/apiCadastrar?action=editar`;
      const bodyData = {
        nome: nome, territorio: territorioId, sexo: sexo,identificacao: identificacao,endereco: endereco,
        referenciaFamiliar: referenciaFamiliar,centroSaude: centroSaude,deficiencia: deficiencia,
        situacaoRua: situacaoRua, categoria: categoriaId, tecnico: tecnicoId, 
        acolhimento: acolhimento, orgaoEncaminhador: orgaoEncaminhador, referencia: referencia,
        vulnerabilidade: idVulnerabilidade, violacao: idViolacao,encaminhamento: idEncaminhamento, sigps: sigps,
        dilacao: dilacao, dataDilacao: dataDilacao, idPessoa: pessoa.idPessoa, idAtendimento: pessoa.idAtendimento
      };
      const response=await fetch(endpont,{method: "PUT", cache: "reload", headers: { "Content-Type": "application/json", }, body: JSON.stringify(bodyData) })
      const data = await response.json();
      if(response.status === 201){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Cadastro alterado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Editar"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  async function finalizar(){
    try{
      const endpont = `/api/apiCadastrar?action=finalizar`;
      const bodyData = { finalizar: "Sim", idAtendimento: pessoa.idAtendimento };
      const response=await fetch(endpont,{method: "PUT", cache: "reload", headers: { "Content-Type": "application/json", }, body: JSON.stringify(bodyData) })
      const data = await response.json();
      if(response.status === 201){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Atendimento finalizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Editar"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  async function excluir(){
    try{
      const endpont = `/api/apiCadastrar?action=excluir`;
      const bodyData = { idPessoa: pessoa.idPessoa, idAtendimento: pessoa.idAtendimento };
      const response=await fetch(endpont,{method: "DELETE", cache: "reload", headers: { "Content-Type": "application/json", }, body: JSON.stringify(bodyData) })
      const data = await response.json();
      if(response.status === 201){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Atendimento excluido com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Editar"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);onClose()}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  const editDateTime = (data: string) => {
    const date = new Date(data);

    const dd = String(date.getDate()).padStart(2, '0');  
    const mm = String(date.getMonth() + 1).padStart(2, '0');  
    const yyyy = date.getFullYear(); 

    const hh = String(date.getHours()).padStart(2, '0');  
    const mi = String(date.getMinutes()).padStart(2, '0'); 

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  };

  return (
    <div className="cadastroOverlay">
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <div className="cadastroModal">
        {/* Cabeçalho */}
        <div className="cadastroModal_header">
          <h2>Cadastro Individual</h2>
          <button className="cadastroModal_close" onClick={onClose}>✕</button>
        </div>

        {/* Conteúdo */}
        <div className="cadastroModal_content">
          <div>
            <p style={{color:"#fc8a38", fontWeight:"bold"}}>
              Paciente
            </p>
            <div style={{border:"solid 1px #fc8a38", width:"100%", height:"0px"}}></div>
          </div>

          <div className="cadastroModal_item">
            <label>Nome</label>
            {edit?
              <input type="text" placeholder="Digite o nome" value={nome} onChange={(evt)=>{setNome(evt.target.value)}}></input>
            :
              <p>{nome}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Referência Familiar</label>
            {edit?
              <input type="text" placeholder="Digite a referência familiar" value={referenciaFamiliar} onChange={(evt)=>{setReferenciaFamiliar(evt.target.value)}}></input>
            :
              <p>{referenciaFamiliar}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Identificação</label>
            {edit?
              <input type="text" placeholder="Digite a identificação" value={identificacao} onChange={(evt)=>{setIdentificacao(evt.target.value)}}></input>
            :
              <p>{identificacao}</p>
            }
          </div>

          <div>
            <p style={{color:"#fc8a38", fontWeight:"bold"}}>
              Prazos
            </p>
            <div style={{border:"solid 1px #fc8a38", width:"100%", height:"0px"}}></div>
          </div>
          
          <div className="cadastroModal_item">
            <label>Data de Recebimento</label>
            <p>{editDateTime(pessoa.dataRecebimento)}</p>
          </div>
          <div className="cadastroModal_item">
            <label>Prazo Final Previsto do Atendimento</label>
            <p>{pessoa.fimPrevistoAtendimento == null ? "" : editDateTime(pessoa.fimPrevistoAtendimento)}</p>
          </div>
          <div className="cadastroModal_item">
            <label>Dilação</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={dilacao} onChange={(e) => setDilacao(e.target.value)}>
                <option hidden>selecione</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            :
              <p>{dilacao}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Data da Dilação</label>
            {edit?
              <input type="datetime-local" value={dataDilacao} onChange={(evt)=>{setDataDilacao(evt.target.value)}}></input>
            :
              <p>{dataDilacao}</p>
            }
          </div>

          <div>
            <p style={{color:"#fc8a38", fontWeight:"bold"}}>
              Dados do paciente
            </p>
            <div style={{border:"solid 1px #fc8a38", width:"100%", height:"0px"}}></div>
          </div>
          
          <div className="cadastroModal_item">
            <label>Endereço</label>
            {edit?
              <input type="text" placeholder="Digite o endereço" value={endereco} onChange={(evt)=>{setEndereco(evt.target.value)}}></input>
            :
              <p>{endereco}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Território</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={territorioId} onChange={(e) => {setTerritorioId(Number(e.target.value))}}>
                {dataTerritorios.map((t, index)=>(
                  <option key={index} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            :
              <p>{pessoa.territorio}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Centro de Saúde</label>
            {edit?
              <input type="text" placeholder="Digite o centro de saúde" value={centroSaude} onChange={(evt)=>{setCentroSaude(evt.target.value)}}></input>
            :
              <p>{centroSaude}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Sexo</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option hidden>selecione</option>
                <option>F</option>
                <option>M</option>
              </select>
            :
              <p>{sexo}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Possui Deficiência?</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={deficiencia} onChange={(e) => setDeficiencia(e.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            :
              <p>{deficiencia}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Situação de Rua?</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={situacaoRua} onChange={(e) => setSituacaoRua(e.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            :
              <p>{situacaoRua}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Categoria</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
                {dataCategorias && dataCategorias.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            :
              <p>{pessoa.categoria}</p>
            }
          </div>

          <div>
            <p style={{color:"#fc8a38", fontWeight:"bold"}}>
              Dados do atendimento
            </p>
            <div style={{border:"solid 1px #fc8a38", width:"100%", height:"0px"}}></div>
          </div>
          
          <div className="cadastroModal_item">
            <label>Tecnico Responsável</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={tecnicoId} onChange={(e) => setTecnicoId(Number(e.target.value))}>
                {dataTecnico && dataTecnico.map((c, index)=>(
                  <option key={index} value={c.id}>{c.nome}</option>
                ))}
              </select>
            :
              <p>{pessoa.tecnicoResponsavel}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Acolhimento Institucional</label>
            {edit?
              <input type="text" placeholder="Digite o acolhimento institucional" value={acolhimento} onChange={(evt)=>{setAcolhimento(evt.target.value)}}></input>
            :
              <p>{acolhimento}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Encaminhamento</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={idEncaminhamento} onChange={(e) => setIdEncaminhamento(Number(e.target.value))}>
                {dataEncaminhamento && dataEncaminhamento.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            :
              <p>{pessoa.encaminhamento}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Referência</label>
            {edit?
              <input type="text" placeholder="Digite o nome" value={referencia} onChange={(evt)=>{setReferencia(evt.target.value)}}></input>
            :
              <p>{referencia}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Vulnerabilidade</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={idVulnerabilidade} onChange={(e) => setIdVulnerabilidade(Number(e.target.value))}>
                {dataVulnerabilidade && dataVulnerabilidade.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            :
              <p>{pessoa.vulnerabilidade}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Violação</label>
            {edit?
              <select className="pesquisaArea2_div_select" value={idViolacao} onChange={(e) => setIdViolacao(Number(e.target.value))}>
                {dataViolacao && dataViolacao.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            :
              <p>{pessoa.violacao}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>Orgão Encaminhador</label>
            {edit?
              <input type="text" placeholder="Digite o nome" value={orgaoEncaminhador} onChange={(evt)=>{setOrgaoEncaminhador(evt.target.value)}}></input>
            :
              <p>{orgaoEncaminhador}</p>
            }
          </div>
          <div className="cadastroModal_item">
            <label>SIGPS</label>
            {edit?
              <input type="text" placeholder="Digite o nome" value={sigps} onChange={(evt)=>{setSigps(evt.target.value)}}></input>
            :
              <p>{sigps}</p>
            }
          </div>
        </div>

        <div className="cadastroModal_buttons">
          <button className="cadastroModal_buttonsEditar" onClick={()=>{saveEdit()}}>{edit?"Salvar":"Editar"}</button>
          {!edit&&<button className="cadastroModal_buttonsFinalizar" onClick={()=>{finalizar()}}>Concluir</button>}
          {!edit &&
            <>
              {permissao == "Administrador" && <button className="cadastroModal_buttonsExcluir" onClick={()=>{excluir()}}>Excluir</button>}
            </>
          }
        </div>
      </div>
    </div>
  );
}