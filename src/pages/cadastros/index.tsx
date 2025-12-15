import Menu from "../../../components/menu/Menu";
import { useState, useEffect } from "react";
import Image from "next/image";
import { TypePessoa } from "../../../components/type";
import CadastroIndividual from "./cadastroIndividual";
import Alerta from "../../../components/alerta/Alerta";
import { useRouter } from "next/router";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Cadastros() {
  const [nome, setNome] = useState("");
  const [referenciaFamiliar, setReferenciaFamiliar] = useState("");
  const [endereco, setEndereco] = useState("");
  const [territorio, setTerritorio] = useState("");
  const [showAlerts,setshowAlerts]= useState(false);
  const [searchResults, setSearchResults] = useState<TypePessoa[]>([]);
  const [selectedIds, setSelectedIds] = useState<number>(-1);
  const [personSelect, setPersonSelect] = useState<TypePessoa | undefined>(undefined);
  const [cadastro, setCadastro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const perm = localStorage.getItem("permissão");
    if(!perm){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Redirecionando para o login",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false);router.push("/");}]
      } 
    }else{
      handleGetAll();
    }
  }, [cadastro]);

  const handleGetAll = async () => {
    try {
      const endpoint = "/api/apiCadastros?action=getAll";
      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.status === 200) {
        setSearchResults(data.person);
      }
    } catch (error) {
      console.log("Erro ao buscar todos:", error);
    }
  };

  const handleValidarPesquisar = () => {
    setPersonSelect(undefined);

    if (!nome && !referenciaFamiliar && !endereco && !territorio) {
      handleGetAll();
    }else{
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const endpoint = `/api/apiCadastros?nome=${nome}&referencia=${referenciaFamiliar}&endereco=${endereco}&territorio=${territorio}&action=search`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.status === 200) {
        setSearchResults(data.person);
        setNome("");
        setReferenciaFamiliar("");
        setEndereco("");
        setTerritorio("");
      }
    } catch (error) {
      console.log("Erro na busca:", error);
    }
  };

  const toggleSelection = (id: number) => {
    if (selectedIds === id) {
      setSelectedIds(-1);
      setPersonSelect(undefined);
      setCadastro(false);
    }else{
      setSelectedIds(id);
      setCadastro(true);
      const pessoa = searchResults.find((p) => p.idPessoa === id);
      setPersonSelect(pessoa);
    }
  };

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
    <div className="cadastros">
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <Menu page={1} cadastro={cadastro} />
      <p className="cadastrosTitulo">Atendimentos Não Finalizados</p>
      <div className="pesquisaArea">
        <div className="pesquisaArea_div">
          <label className="pesquisaArea_div_label">Nome</label>
          <input
            className="pesquisaArea_div_input"
            type="text"
            value={nome}
            placeholder="Digite o nome"
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="pesquisaArea_div">
          <label className="pesquisaArea_div_label">Referência Familiar</label>
          <input
            className="pesquisaArea_div_input"
            type="text"
            value={referenciaFamiliar}
            placeholder="Digite a referência"
            onChange={(e) => setReferenciaFamiliar(e.target.value)}
          />
        </div>

        <div className="pesquisaArea_div">
          <label className="pesquisaArea_div_label">Endereço</label>
          <input
            className="pesquisaArea_div_input"
            type="text"
            value={endereco}
            placeholder="Digite o endereço"
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        <div className="pesquisaArea_div">
          <label className="pesquisaArea_div_label">Território</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              className="pesquisaArea_div_input"
              type="text"
              value={territorio}
              placeholder="Digite o território"
              onChange={(e) => setTerritorio(e.target.value)}
            />
            <Image
              onClick={handleValidarPesquisar}
              alt="buscar"
              height={35}
              width={35}
              src={"./images/search_orange.svg"}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      <br></br>
      <div style={{display:"flex", paddingLeft :"6%", paddingRight:"10%"}}>
        <p className="truncate" style={{width:"100%", display:"flex", justifyContent:"center"}}>Nome</p>
        <p className="truncate" style={{width:"100%", display:"flex", justifyContent:"center"}}>Referência familiar</p>
        <p className="truncate" style={{width:"100%", display:"flex", justifyContent:"center"}}>Prazo previsto para atendimento</p>
        <p className="truncate" style={{width:"100%", display:"flex", justifyContent:"center"}}>Em dilação?</p>
        <p style={{width:"20%"}}></p>
      </div>
      <div className="dadosAreaCadastros">
        <div className="dadosArea_boxCadastros">
          <div className="dadosArea_boxAreaCadastros">
            {searchResults.length > 0 ? (
              searchResults.map((person) => (
                <div key={person.idPessoa} className="dadosArea_boxAreaDataCadastros">
                  <div className="dadosArea_boxAreaPersonCadastros">
                    <p className="truncate" style={{display:"flex", justifyContent:"center"}}>{person.nome}</p>
                    <p className="truncate text-[#7b7e79]" style={{display:"flex", justifyContent:"center"}}>{person.referenciaFamiliar}</p>
                    <p className="truncate text-[#7b7e79]" style={{display:"flex", justifyContent:"center"}}>
                      {person.fimPrevistoAtendimento == null ? "Não informado" : editDateTime(person.fimPrevistoAtendimento)}
                    </p>
                    <p className="truncate text-[#7b7e79]" style={{display:"flex", justifyContent:"center"}}>{person.dilacao}</p>
                    <div style={{width:"15%"}}>
                      <Image onClick={() => toggleSelection(person.idPessoa)} alt="buscar" height={45} width={45} src={"./images/eye_icon.svg"} style={{ cursor: "pointer" }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum cadastro encontrado.</p>
            )}
          </div>
        </div>
      </div>
      {cadastro && personSelect && (
        <CadastroIndividual
          pessoa={personSelect}
          onClose={() => {
            setCadastro(false);
            setPersonSelect(undefined);
            setSelectedIds(-1);
          }}
        />
      )}
    </div>
  );
}