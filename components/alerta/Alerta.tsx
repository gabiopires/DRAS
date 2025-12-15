import {TypeDataAlerts} from "../type"

interface AlertsProps{
    dataAlert: TypeDataAlerts
}

export default function Alerta(props: AlertsProps) {

  return(
        <div className="bodyAlert">
            <div className="boxAlert">
                <div className="boxAlertText">
                    {props.dataAlert.alertText}
                </div>
                <div className="boxButtonAlerts">
                    {props.dataAlert.alertButtons.map((btn, index)=>(
                        <button key={index} className="buttonAlerts" style={index == 0 ?{backgroundColor:"#FC8A38"}:{backgroundColor:"#7B7E79"}} 
                            onClick={()=>{props.dataAlert.alertsCommans[index]()}}
                        >
                            {btn}
                        </button>   
                    ))}
                </div>
            </div>
        </div>
    )
}
