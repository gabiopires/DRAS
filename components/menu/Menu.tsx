import Topo from "../topo/Topo"
import Image from "next/image";
import Alerta from "../alerta/Alerta"
import { useState } from "react";
import { useRouter } from "next/router";
import { TypeDataAlerts } from "../type";

let dataAlerts:TypeDataAlerts ={
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

interface MenuProps {
    page: number,
    cadastro?:boolean,
}

// page Legenda:
// 1 == página de cadastros
// 2 == página cadastrar
// 3 == página exportar
// 4 == página de relatórios
// 5 == página do perfil

export default function Menu(props: MenuProps) {

    const router = useRouter();
    const [showAlerts,setShowAlerts] = useState(false);
    const [showMenu, setShowMenu] = useState(false)

    const handleValidar = (page: string)=>{
        setShowAlerts(true)
        dataAlerts = {
          alertText: "Deseja realmente cancelar o cadastro em andamento?",
          alertButtons: ["Sair e cancelar", "Continuar o cadastro"],
          alertsCommans: [()=>{router.push(page)},()=>{setShowAlerts(false)}]
        }
    }

    function deslogar(){
        localStorage.removeItem("id");
        localStorage.removeItem("permissão");
        localStorage.removeItem("userId");
        router.push("/");
    }

    return (
        <div className={showMenu == true ? "contentLeft" : "content"}>
            {showAlerts && <Alerta dataAlert={dataAlerts}/>}
            <Topo page={props.page} onClick={()=>{setShowMenu(!showMenu)}}/>
            <div className="menuOptions">
                <div className={props.page == 2 ? "menuOptions_optionSelect" : "menuOptions_option"} 
                    onClick={props.cadastro == true && props.page == 2 ? ()=>handleValidar("./cadastrar"): ()=>router.push("./cadastrar")}
                >
                    <Image className="menuOptions_icon" src={props.page == 2 ? "./images/add_notes_orange.svg" : "./images/add_notes_gray.svg"} alt="" width={100} height={100}/>
                    <p className="menuOptions_title">Cadastrar</p>
                </div>
                <div className={props.page == 1 ? "menuOptions_optionSelect" : "menuOptions_option"} 
                    onClick={props.cadastro == true && props.page == 2 ? ()=>handleValidar("./cadastros") : ()=>router.push("./cadastros")}
                >
                    <Image className="menuOptions_icon" src={props.page == 1 ? "./images/clinical_notes_orange.svg" : "./images/clinical_notes_gray.svg"} alt="" width={100} height={100}/>
                    <p className="menuOptions_title">Cadastros</p>
                </div>
                <div className={props.page == 3 ? "menuOptions_optionSelect" : "menuOptions_option"} 
                    onClick={props.cadastro == true && props.page == 2 ? ()=>handleValidar("./exportar") : ()=>router.push("./exportar")}
                >
                    <Image className="menuOptions_icon" src={props.page == 3 ? "./images/file_save_orange.svg" : "./images/file_save_gray.svg"} alt="" width={100} height={100}/>
                    <p className="menuOptions_title">Exportar</p>
                </div>
                <div className={props.page == 4 ? "menuOptions_optionSelect" : "menuOptions_option"} 
                    onClick={props.cadastro == true && props.page == 2 ? ()=>handleValidar("./relatorios") :()=>router.push("./relatorios")}
                >
                    <Image className="menuOptions_icon" src={props.page == 4 ? "./images/bar_chart_orange.svg" : "./images/bar_chart_gray.svg"} alt="" width={100} height={100}/>
                    <p className="menuOptions_title">Relatórios</p>
                </div>
            </div>
            <div className="logout" onClick={()=>{deslogar()}}>
                <Image className="menuOptions_icon" src={"./images/logout.svg"} alt="" width={100} height={100}/>
                Deslogar
            </div>
        </div>
    );
}
