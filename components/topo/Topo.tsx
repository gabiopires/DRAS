import Image from "next/image";
import { useRouter } from "next/router";

interface TopoProps {
  page: number,
  onClick: ()=>void
}

export default function Topo(props: TopoProps) {

  const router = useRouter()

  return (
    <div className="contentTopo">
      <p className="contentTopo_name">DRAS</p>
      <Image className="menuTopo" alt="" src="./images/menu_orange.svg" width={100} height={100} onClick={props.onClick}/>
      <Image onClick={()=>router.push("./perfil")} className="contentTopo_profile" alt="" src={props.page == 5 ? "./images/account_circle_orange.svg" : "./images/account_circle_white.svg"} width={100} height={100}/>
    </div>
  );
}
