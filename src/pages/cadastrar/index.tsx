import Menu from "../../../components/menu/Menu"
import { useState, useEffect } from "react";
import Image from "next/image";
import { TypePessoa, ExcelRow, ApiPayload, ImportResult } from "../../../components/type";
import Alerta from "../../../components/alerta/Alerta";
import * as XLSX from "xlsx";
import { useRouter } from "next/router";
import Import from "../../../components/import/Import"

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

export default function Cadastrar() {

  const [pessoaId, setPessoaId] = useState(1)
  const [nome, setNome] = useState('');
  const [referenciaFamiliar, setReferenciaFamiliar] = useState('');
  const [endereco, setEndereco] = useState('');
  const [nomeSearch, setNomeSearch] = useState('');
  const [referenciaFamiliarSearch, setReferenciaFamiliarSearch] = useState('');
  const [enderecoSearch, setEnderecoSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState( 1);
  const [searchResults, setSearchResults] = useState<TypePessoa[]>([]);
  const [personSelect, setPersonSelect] = useState(false);
  const [page, setPage] = useState(1);
  const [cadastro, setCadastro] = useState(false);
  const [identificacao, setIdentificacao] = useState("");
  const [tipoIdentificacao, setTipoIdentificacao] = useState(1);
  const [territorio, setTerritorio] = useState(1);
  const [centroSaude, setCentroSaude] = useState(1);
  const [sexo, setSexo] = useState("");
  const [deficiencia, setDeficiencia] = useState("");
  const [situacaoRua, setSituacaoRua] = useState("");
  const [categoria, setCategoria] = useState(1);
  const [dataRecebimento, setDataRecebimento] = useState("");
  const [tecnico, setTecnico] = useState(1);
  const [acolhimento, setAcolhimento] = useState("");
  const [orgaoEncaminhador, setOrgaoEncaminhador] = useState("");
  const [referencia, setReferencia] = useState("");
  const [vulnerabilidade, setVulnerabilidade] = useState(1);
  const [violacao, setViolacao] = useState(1);
  const [encaminhamento, setEncaminhamento] = useState(1);
  const [sigps, setSigps] = useState("");
  const [prazoAtendimento, setPrazoAtendimento] = useState(1);
  const [fimPrevisto, setFimPrevisto] = useState("");
  const [dataCategorias, setDataCategorias] = useState<{id: string; descricao: string}[]>([]);
  const [dataVulnerabilidade, setDataVulnerabilidade] = useState<{id: string, descricao: string}[]>([]);
  const [dataViolacao, setDataViolacao] = useState<{id: string, descricao: string}[]>([]);
  const [dataTecnico, setDataTecnico] = useState<{id: string, nome: string}[]>([]);
  const [dataTerritorios, setDataTerritorio] = useState<{id: string, descricao: string}[]>([]);
  const [dataCentroSaude, setDataCentroSaude] = useState<{id: string, descricao: string}[]>([]);
  const [dataEncaminhamento, setDataEncaminhamento] = useState<{id: string, descricao: string}[]>([]);
  const [dataPrazo, setDataPrazo] = useState<{id: string, descricao: string}[]>([]);
  const [dataIdentificacao, setDataIdentificacao] = useState<{id: string, descricao: string}[]>([]);
  const [showAlerts,setshowAlerts]= useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    const data = editDate();
    setDataRecebimento(data);
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
        setDataPrazo(data.prazoAtendimento);
        setDataIdentificacao(data.tiposIdentificacao);
        setDataCentroSaude(data.centroSaude)
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleValidarPesquisar = ()=>{
    setPersonSelect(false);
    setSearchResults([]);
    if (nomeSearch == "" && referenciaFamiliarSearch == "" && enderecoSearch == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um valor valido para pesquisar",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if (nomeSearch == null && referenciaFamiliarSearch == null && enderecoSearch == null){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um valor valido para pesquisar",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if (nomeSearch == "null" && referenciaFamiliarSearch == "null" && enderecoSearch == "null"){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um valor valido para pesquisar",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else{
      handleSearch()
    }
  }

  const handleSearch = async () => {
    try{
      const endpont = `/api/apiCadastrar?nome=${nomeSearch}&referencia=${referenciaFamiliarSearch}&endereco=${enderecoSearch}&action=search`;
      const response=await fetch(endpont,{method: "GET", cache:"reload"})
      const data = await response.json();
      if(response.status === 200){
        setSearchResults(data.person)
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Atendimento não encontrado",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    }catch(error){
      console.log(error)
    }
    setNomeSearch("");
    setEnderecoSearch("");
    setReferenciaFamiliarSearch("")
  };

  const CadastrarNovaPessoa = async () =>{
    try{
      const endpont = `/api/apiCadastrar?action=cadastrar`;
      const bodyData = {
        nome: nome, territorio: territorio, sexo: sexo,identificacao: identificacao,endereco: endereco,
        referenciaFamiliar: referenciaFamiliar,centroSaude: centroSaude,deficiencia: deficiencia,
        situacaoRua: situacaoRua, categoria: categoria, dataRecebimento: dataRecebimento, tecnico: tecnico, 
        acolhimento: acolhimento, orgaoEncaminhador: orgaoEncaminhador, referencia: referencia,
        vulnerabilidade: vulnerabilidade, violacao: violacao,encaminhamento: encaminhamento, sigps: sigps, 
        prazoAtendimento: prazoAtendimento, tipoIdentificacao: tipoIdentificacao, fimPrevisto: fimPrevisto
      };
      const response=await fetch(endpont,{method: "POST", cache: "reload", headers: { "Content-Type": "application/json", }, body: JSON.stringify(bodyData) })
      const data = await response.json();
      if(response.status === 201){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Cadastro realizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);router.push("/cadastros")}]
        }
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  const CadastrarNovoAtendimento = async () =>{
    try{
      const endpont = `/api/apiCadastrar?action=cadastrarAtendimento`;
      const bodyData = {
        pessoaId:pessoaId, dataRecebimento: dataRecebimento, tecnico: tecnico, 
        acolhimento: acolhimento, orgaoEncaminhador: orgaoEncaminhador, referencia: referencia,
        vulnerabilidade: vulnerabilidade, violacao: violacao,encaminhamento: encaminhamento, sigps: sigps, 
        prazoAtendimento: prazoAtendimento, fimPrevisto: fimPrevisto
      };
      const response=await fetch(endpont,{method: "POST", cache: "reload", headers: { "Content-Type": "application/json", }, body: JSON.stringify(bodyData) })
      const data = await response.json();
      if(response.status === 201){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Cadastro realizado com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false);router.push("/cadastros")}]
        }
      }else if (response.status === 401){
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }else{
        setshowAlerts(true)
        dataAlerts = {
          alertText: "Erro inesperado no servidor, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [()=>{setshowAlerts(false)}]
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowImport(false)
    const uploadedFile = e.target.files?.[0];
    if(uploadedFile) {
      handleImport(uploadedFile);
    }else {
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Nenhum arquivo selecionado",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }
  };

  const handleImport = (fileToImport: File) => {
    if (fileToImport) {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const binaryStr = e.target.result as string;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
            defval: "",
          });

          // Zera resultados anteriores e abre modal
          setImportResults([]);
          setShowImportModal(true);

          const payloads: ApiPayload[] = jsonData.map((row) =>
            mapExcelRowToApiPayload(row, null)
          );

          for (const payload of payloads) {
            try {
              const response = await fetch(
                "/api/apiCadastrar?action=cadastrar",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                }
              );

              if (!response.ok) {
                console.error("Erro ao cadastrar:", payload.nome, response.status);
                setImportResults((prev) => [
                  ...prev,
                  { ...payload, status: "erro" },
                ]);
              } else {
                setImportResults((prev) => [
                  ...prev,
                  { ...payload, status: "concluido" },
                ]);
              }
            } catch (err) {
              console.error("Erro de rede ao cadastrar:", payload.nome, err);
              setImportResults((prev) => [
                ...prev,
                { ...payload, status: "erro" },
              ]);
            }
          }
          setIsImporting(false);
        } else {
          console.error("Falha ao carregar o arquivo.");
        }
      };

      reader.readAsBinaryString(fileToImport);
      setImportResults([]);
      setShowImportModal(true);
      setIsImporting(true); 
    }
  };

  const mapExcelRowToApiPayload = (
    row: ExcelRow,
    defaultTecnico: number | null
  ): ApiPayload => {
    return {
      nome: row.nome,
      territorio: Number(row.idTerritorio),
      sexo: row.sexo,
      identificacao: String(row.identificacao),
      tipoIdentificacao: Number(row.idTipoIdentificacao),
      endereco: row.endereco,
      referenciaFamiliar: row.referenciaFamiliar,
      centroSaude: Number(row.idCentroSaude),
      deficiencia: row.deficiencia,
      situacaoRua: row.situacaoRua,
      categoria: Number(row.idCategoria),
      dataRecebimento:
        typeof row.dataRecebimento === "number"
          ? excelSerialDateToLocalISO(row.dataRecebimento)
          : row.dataRecebimento,
      tecnico: defaultTecnico, // pode ser null se não tiver no Excel
      acolhimento: row.acolhimentoInstitucional,
      orgaoEncaminhador: row.orgaoEncaminhador,
      referencia: row.referencia,
      vulnerabilidade: Number(row.idVulnerabilidade),
      violacao: Number(row.idViolacao),
      encaminhamento: Number(row.idEncaminhamento),
      sigps: row.sigps,
      prazoAtendimento: Number(row.idPrazoAtendimento),
      fimPrevisto: null,
    };
  };

  const toggleSelection = (id: number) => {
    const tmp = selectedIds;
    if(tmp == id){
      setSelectedIds(-1);
    }else{
      setCadastro(true);
      setSelectedIds(id);
      searchResults.map((person)=>{
        if(id == person.idPessoa){
          setPersonSelect(true);
          setPessoaId(person.idPessoa)
          setNome(person.nome);
          setIdentificacao(person.identificacao);
          setTipoIdentificacao(person.idTipoIdentificacao)
          setReferenciaFamiliar(person.referenciaFamiliar);
          setEndereco(person.endereco);
          setTerritorio(person.idTerritorio);
          setCentroSaude(person.idCentroSaude);
          setSexo(person.sexo);
          setDeficiencia(person.deficiencia);
          setSituacaoRua(person.situacaoRua);
          setCategoria(person.idCategoria);
        }
      })
    }
  };

  const handleNext = (button: string) => {
    if(page== 1){setPage(2)}
    else if (page == 2 && button == "voltar"){setPage(1)}
    else if (page == 2 && button == "proximo"){setPage(3)}
    else if (page == 3 && button == "voltar"){setPage(2)}
    else if (page == 3 && button == "concluir"){handleAddNew()}
  };

  const handleAddNew = () =>{
    if(nome == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um nome",
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
        alertText: "Digite uma identificação. Caso não possua, digite: sem identificação",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(endereco == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um endereço. Caso não possua, digite: sem endereço",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(referenciaFamiliar == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite uma referência familiar. Caso não possua, digite: sem referência familiar",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(deficiencia == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione se possui deficiência.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(situacaoRua == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Selecione se está em situação de rua.",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      } 
    }else if(dataRecebimento == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite a data do recebimento",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(acolhimento == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um acolhimento institucional. Caso não possua, digite: sem acolhimento institucional",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(orgaoEncaminhador == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um orgão encaminhador. Caso não possua, digite: sem orgão encaminhador",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(referencia == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite uma referência. Caso não possua, digite: sem referência",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else if(sigps == ""){
      setshowAlerts(true)
      dataAlerts = {
        alertText: "Digite um SIGPS. Caso não possua, digite: sem SIGPS",
        alertButtons: ["Ok"],
        alertsCommans: [()=>{setshowAlerts(false)}]
      }
    }else{
      if(personSelect){
        CadastrarNovoAtendimento()
      }else{
        CadastrarNovaPessoa()
      }
    }
  }

  const editDate = () => {
    const d = new Date(); 
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  };

  const excelSerialDateToLocalISO = (serial: number): string => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const ms = serial * 24 * 60 * 60 * 1000;
    const d = new Date(excelEpoch.getTime() + ms);

    const pad = (n: number) => String(n).padStart(2, "0");

    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const getPrazoDias = (idPrazo: number) => {
    const prazo = dataPrazo.find((p) => Number(p.id) === idPrazo);
    if (!prazo) return 0;

    const match = Number(prazo.descricao);
    addDaysAndFormatDate(dataRecebimento, match)
  };

  const addDaysAndFormatDate = (start: string, days: number) => {
    const dias = Number(days);
    if (!start || !Number.isFinite(dias) || dias <= 0) return "";

    const [year, month, day] = start.split("-").map(Number);
    const d = new Date(year, month - 1, day); 

    d.setDate(d.getDate() + dias);

    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());

    const fim = `${yyyy}-${mm}-${dd}`;
    setFimPrevisto(fim);
  };

  const handleDownloadModelo = () => {
    const link = document.createElement("a");
    link.href = "/modelos/importarDados.xlsx"; 
    link.download = "importarDados.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cadastrar">
      {showAlerts&&<Alerta dataAlert={dataAlerts}/>}
      <Menu page={2} cadastro={cadastro}/>
      {showImportModal &&<Import open={showImportModal} onClose={() => {setShowImportModal(false);router.push("/cadastros")}} results={importResults} isProcessing={isImporting}/>}
      
      {showImport &&
        <div className="import">
          <div className="importContent">
            <div className="importContentC">
              <p className="importContentClose" onClick={()=>{setShowImport(false)}}>X</p>
            </div>
            <div className="importContentIm">
              <p className="importContentIm_aviso">Para importar, certifique que a planilha esteja no modelo certo. Caso contrário a importação não funcionará!</p>
              <div className="importContentIm_modelo">
                <p className="importContentIm_modeloText">Baixe o modelo de planilha para importação aqui: </p>
                <button onClick={()=>{handleDownloadModelo()}}>Baixar</button>
              </div>
              <p className="importContentIm_aviso">Após o download da planilha modelo, preencha os dados dentro dela, um atendimento por linha. Quando finalizar, envie a planilha preenchida abaixo:</p>
              <div className="importContentIm_modelo">
                <p className="importContentIm_modeloText">Importar dados:</p>
                <div className="importarArea_button">
                  Importar
                  <input className="importarArea_input" type="file" accept=".xlsx, .xls" onChange={handleFileChange}></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {page == 1 ? 
      <div className="cadastrarContent">
        <div className="importarArea">
          <div className="importarArea_button" onClick={()=>{setShowImport(true)}}>
            Importar
            <Image src={"./images/article_shortcut.svg"} alt="" height={100} width={100} className="importarArea_icon"/>
          </div>
          <p className="importarArea_page">1/3</p>
        </div>
        <p className="cadastrarTitulo">Buscar atendimentos existentes:</p>
        <div className="pesquisaArea">
          <div className="pesquisaArea_div">
            <label className="pesquisaArea_div_label">Nome</label>
            <input className="pesquisaArea_div_input" type="text" value={nomeSearch} placeholder="Digite o nome"
              onChange={(e) => setNomeSearch(e.target.value)} 
            />
          </div>
          <div className="pesquisaArea_div">
            <label className="pesquisaArea_div_label">Referência Familiar</label>
            <input className="pesquisaArea_div_input" type="text" value={referenciaFamiliarSearch} placeholder="Digite a referência"
              onChange={(e) => setReferenciaFamiliarSearch(e.target.value)}
            />
          </div>
          <div className="pesquisaArea_div">
            <label className="pesquisaArea_div_label">Endereço</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea_div_input" type="text" value={enderecoSearch} placeholder="Digite o endereço"
                onChange={(e) => setEnderecoSearch(e.target.value)}
              />
              <Image onClick={handleValidarPesquisar} alt="buscar" height={100} width={100} src={"./images/search_orange.svg"} style={{width:"50px", cursor:"pointer"}}/>
            </div>
          </div>
        </div>
        <div className="dadosArea">
          <p style={{fontSize: "18px"}}>Dados encontrados</p>
          <div className="dadosArea_box">
            {searchResults.length > 0 ? (
              <div className="dadosArea_boxArea">
                {searchResults.map((person, index) => (
                  <div key={index} className="dadosArea_boxAreaData">
                    <button onClick={() => toggleSelection(person.idPessoa)} className={person.idPessoa == selectedIds ? 'dadosArea_boxAreaButtonSelect' : 'dadosArea_boxAreaButton'}>
                      {person.idPessoa == selectedIds && (
                        <div className="dadosArea_boxAreaPonto"/>
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
        </div>
        <div className="buttonNextArea">
          <button onClick={()=>handleNext("proximo")} className="buttonNextArea_button" >
            Próximo
          </button>
        </div>
      </div>

      : page == 2 ?
      <div className="cadastrarContent">
        <div className="importarArea">
          <p className="importarArea_page">Dados do paciente</p>
          <p className="importarArea_page">2/3</p>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Nome</label>
            <input className="pesquisaArea2_div_input" type="text" value={nome} placeholder="Digite o nome" onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Identificação</label>
            <input className="pesquisaArea2_div_input" type="text" value={identificacao} placeholder="Digite a identificação" onChange={(e) => setIdentificacao(e.target.value)} />
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Tipo de Identificação</label>
            <select className="pesquisaArea2_div_select" value={tipoIdentificacao} onChange={(e) => setTipoIdentificacao(Number(e.target.value))}>
              <option hidden>{"selecione"}</option>
              {dataIdentificacao.map((c, index)=>(
                <option key={index} value={c.id}>{c.descricao}</option>
              ))}
            </select>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Referência Familiar</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" value={referenciaFamiliar} placeholder="Digite a referencia familiar" onChange={(e) => setReferenciaFamiliar(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Endereço</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" value={endereco} placeholder="Digite o endereço" onChange={(e) => setEndereco(e.target.value)} />
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Territorio</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select"  value={territorio} onChange={(e) => setTerritorio(Number(e.target.value))}>
                <option hidden>{"selecione"}</option>
                {dataTerritorios.map((t, index)=>(
                  <option key={index} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Centro de Saude</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={centroSaude} onChange={(e) => setCentroSaude(Number(e.target.value))}>
                <option hidden>{"selecione"}</option>
                {dataCentroSaude.map((t, index)=>(
                  <option key={index} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Sexo</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option hidden>{"selecione"}</option>
                <option>F</option>
                <option>M</option>
              </select>
            </div>
          </div>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Possui Deficiencia?</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={deficiencia} onChange={(e) => setDeficiencia(e.target.value)}>
                <option hidden>{"selecione"}</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Situação de Rua?</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={situacaoRua} onChange={(e) => setSituacaoRua(e.target.value)}>
                <option hidden>{"selecione"}</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Categoria</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={categoria} onChange={(e) => setCategoria(Number(e.target.value))}>
                <option hidden>{"selecione"}</option>
                {dataCategorias && dataCategorias.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        

        {/* Next Button */}
        <div className="buttonNextArea">
          <button onClick={()=>handleNext("voltar")} className="buttonNextArea_button" >
            Voltar
          </button>
          <button onClick={()=>handleNext("proximo")} className="buttonNextArea_button" >
            Próximo
          </button>
        </div>
      </div>

      : page == 3 &&
      <div className="cadastrarContent">
        <div className="importarArea">
          <p className="importarArea_page">Dados do atendimento</p>
          <p className="importarArea_page">3/3</p>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Data do Recebimento</label>
            <input className="pesquisaArea2_div_input" type="date" value={dataRecebimento == "" ? editDate() : dataRecebimento} onChange={(e) => {setDataRecebimento(e.target.value);setFimPrevisto("")}} />
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Técnico Responsável</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={tecnico} onChange={(e) => setTecnico(Number(e.target.value))}>
                <option hidden>selecione</option>
                {dataTecnico && dataTecnico.map((c, index)=>(
                  <option key={index} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Acolhimento Institucional</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" value={acolhimento} placeholder="Digite o acolhimento institucional" onChange={(e) => setAcolhimento(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Encaminhamento</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={encaminhamento} onChange={(e) => setEncaminhamento(Number(e.target.value))}>
                <option hidden>selecione</option>
                {dataEncaminhamento && dataEncaminhamento.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Referência</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" value={referencia} placeholder="Digite a referencia" onChange={(e) => setReferencia(e.target.value)} />
            </div>
          </div>
        </div>
        
        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Vulnerabilidade</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={vulnerabilidade} onChange={(e) => setVulnerabilidade(Number(e.target.value))}>
                <option hidden>selecione</option>
                {dataVulnerabilidade && dataVulnerabilidade.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Violação</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={violacao} onChange={(e) => setViolacao(Number(e.target.value))}>
                <option hidden>selecione</option>
                {dataViolacao && dataViolacao.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Orgão Encaminhador</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" placeholder="Digite o SIGPS" value={orgaoEncaminhador} onChange={(e) => setOrgaoEncaminhador(e.target.value)}></input>
            </div>
          </div>
        </div>

        <div className="cadastrarArea2">
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">SIGPS</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="text" value={sigps} placeholder="Digite o SIGPS" onChange={(e) => setSigps(e.target.value)} />
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Prazo de atendimento</label>
            <div style={{display:"flex"}}>
              <select className="pesquisaArea2_div_select" value={prazoAtendimento} onChange={(e) => {setPrazoAtendimento(Number(e.target.value));getPrazoDias(Number(e.target.value))}}>
                <option hidden>selecione</option>
                {dataPrazo && dataPrazo.map((c, index)=>(
                  <option key={index} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pesquisaArea2_div">
            <label className="pesquisaArea_div_label">Data Fim Prevista</label>
            <div style={{display:"flex"}}>
              <input className="pesquisaArea2_div_input" type="date" value={fimPrevisto} onChange={(e) => setFimPrevisto(e.target.value)} />
            </div>
          </div>
        </div>
        

        {/* Concluir Button */}
        <div className="buttonNextArea">
          <button onClick={()=>handleNext("voltar")} className="buttonNextArea_button" >
            Voltar
          </button>
          <button onClick={()=>handleNext("concluir")} className="buttonNextArea_button" >
            Concluir
          </button>
        </div>
      </div>
      }
    </div>
  );
}
