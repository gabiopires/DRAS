import Menu from "../../../components/menu/Menu"
import { useState, useEffect } from "react";
import { TypePessoa } from "../../../components/type";
import Image from "next/image";
import * as XLSX from "xlsx";
import Alerta from "../../../components/alerta/Alerta";
import { useRouter } from "next/router";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Exportar() {

  const [searchResults, setSearchResults] = useState<TypePessoa[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isAllSelected = searchResults.length > 0 && selectedIds.length === searchResults.length;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAlerts,setshowAlerts]= useState(false);
  const router = useRouter();

  const filteredResults = searchResults.filter(person =>
    person.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    const perm = localStorage.getItem("permissão");
    if(!perm){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Redirecionando para o login",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false);router.push("/");}]
      } 
    }else{
      initData();
    }
  },[])

  const initData = async () =>{
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
  }

  const toggleSelection = (id: number) => {
    if (id === 0) {
      if (isAllSelected) {
        setSelectedIds([]);
      } else {
        const allIds = searchResults.map((person) => person.idPessoa);
        setSelectedIds(allIds);
      }
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    })
  };

  const handleExport = () => {
    if (searchResults.length === 0) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Não há dados para exportar.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
      return;
    }
    if (selectedIds.length === 0) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione pelo menos um cadastro para exportar.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
      return;
    }

    const selectedPersons = searchResults.filter((person) =>
      selectedIds.includes(person.idPessoa)
    );

    if (selectedPersons.length === 0) {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Não foi encontrado nenhum registro com os IDs selecionados.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
      return;
    }

    const worksheetData = selectedPersons.map((person) => ({
      Nome: person.nome,
      "Identificação": person.identificacao == null ? "sem identificado" : person.identificacao,
      "Referência familiar": person.referenciaFamiliar,
      "Endereço": person.endereco,
      "Território": person.territorio,
      "Centro de Saúde": person.centroSaude,
      Sexo: person.sexo,
      "Deficiência": person.deficiencia,
      "Situação de Rua": person.situacaoRua,
      Categoria: person.categoria,
      "Data do recebimento": editDateTime(person.dataRecebimento),
      "Acolhimento Institucional": person.acolhimentoInstitucional,
      Encaminhamento: person.encaminhamento,
      "Referência": person.referencia,
      Vulnerabilidade: person.vulnerabilidade,
      "Violação": person.violacao,
      "Orgão Encaminhador": person.orgaoEncaminhador,
      SIGPS: person.sigps,
      "Prazo de Atendimento": person.prazoAtendimento,
      "Dilação": person.dilacao,
      "Data da Dilação": person.dataDilacao
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cadastros");

    XLSX.writeFile(workbook, "cadastros_exportados.xlsx");
  };
  
  const editDateTime = (data: string) => {
    const date = new Date(data);

    const dd = String(date.getDate()).padStart(2, '0');  
    const mm = String(date.getMonth() + 1).padStart(2, '0');  
    const yyyy = date.getFullYear(); 

    const hh = String(date.getHours()).padStart(2, '0');  
    const mi = String(date.getMinutes()).padStart(2, '0'); 

    return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
  };

  return (
    <div className="exportar">
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <Menu page={3}/>
      <div className="exportarSelectArea">
        <select>
          <option hidden>Selecione...</option>
          <option>Justiça Federal</option>
        </select>
      </div>
      <div className="exportardadosArea">
        <div className="dadosArea_box">
          <div className="ExportardadosArea_boxSearch">
            <p style={{fontSize: "18px"}}>Selecione os dados que deseja exportar:</p>
            <div style={{gap:"5px"}}>
              <button onClick={() => toggleSelection(0)} className={isAllSelected ? 'dadosArea_boxAreaButtonSelect' : 'dadosArea_boxAreaButton'}>
                {isAllSelected && (
                  <div className="dadosArea_boxAreaPonto" />
                )}
              </button>
              <p>Selecionar todos</p>
            </div>
            <div>
              <input type="text" placeholder="Pesquisar nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
              <Image style={{cursor:"pointer"}} src={"./images/search_orange.svg"} alt="" width={50} height={50}/>
            </div>
          </div>
          {filteredResults.length > 0 ? (
            <div className="ExportardadosArea_boxArea">
              {filteredResults.map((person, index) => (
                <div key={index} className="ExportardadosArea_boxAreaData">
                  <button onClick={() => toggleSelection(person.idPessoa)} className={selectedIds.includes(person.idPessoa) ? 'dadosArea_boxAreaButtonSelect' : 'dadosArea_boxAreaButton'} >
                    {selectedIds.includes(person.idPessoa) && (
                      <div className="dadosArea_boxAreaPonto" />
                    )}
                  </button>
                  <div className="dadosArea_boxAreaPerson">
                    <p className="truncate">{person.nome}</p>
                    <p className="truncate text-[#7b7e79]">{person.referenciaFamiliar}</p>
                    <p className="truncate text-[#7b7e79]">{person.endereco}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dadosArea_boxArea">
              <div className="dadosArea_boxAreaData" >
                <div className="dadosArea_boxAreaButton" />
                <div className="dadosArea_boxAreaPerson">
                  <p>Nome</p>
                  <p>Referência</p>
                  <p>Endereço</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="exportarButton" onClick={handleExport}>
          Exportar
          <Image className="exportarButtonImage" src={"./images/file_save_white.svg"} alt="" width={100} height={100} />
        </button>
      </div>
    </div>
  );
}
