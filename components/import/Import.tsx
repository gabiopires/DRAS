import { useState } from "react";
import Alerta from "../alerta/Alerta";
import { TypeDataAlerts, ImportResult } from "../type";

const dataAlerts: TypeDataAlerts = {
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
};

interface ImportProps {
    open: boolean;                     
    onClose: () => void;              
    results: ImportResult[];        
    isProcessing: boolean;   
}

export default function Import({ open, onClose, results, isProcessing }: ImportProps) {

    const [showAlerts, setShowAlerts] = useState(false);

    if (!open) return null;

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
        <div className="import">
            {showAlerts && <Alerta dataAlert={dataAlerts} />}
            <div className="importContent">
                <div className="importContent_title">
                   {isProcessing ? 
                        <h2>Importando, aguarde...</h2>:
                        <h2>Importação Concluída</h2>
                    }
                </div>
                <div style={{ fontSize: "14px", marginBottom: "8px",width:"100%" }}>
                    <strong>Total:</strong> {results.length}{" "}|{" "}
                    <strong>Concluídos:</strong>{" "}{results.filter((r) => r.status === "concluido").length}{" "}|{" "}
                    <strong>Erros:</strong>{" "}
                    {results.filter((r) => r.status === "erro").length}
                </div>
                <div className="importContent_box">
                    {results.length === 0 && (
                        <p style={{fontSize: "25px", color: "#ff7a00", fontWeight:"bold"}}>
                            Enviando registros...
                        </p>
                    )}
                    {results.map((item, index) => (
                        <div key={index} className="import_boxCadatro">
                            <div className="import_boxCadatroNome">
                                <span className="import_boxCadatroSpanNome">
                                    {item.nome}
                                </span>
                                <span style={{ fontWeight: 600, color: item.status === "concluido" ? "green" : "red", }} >
                                    {item.status === "concluido" ? "Concluído" : "Erro"}
                                </span>
                            </div>
                            <div style={{ fontSize: "12px", color: "#555"}}>
                                <div><strong>Endereço:</strong> {item.endereco}</div>
                                <div><strong>Referência fam.:</strong> {item.referenciaFamiliar}</div>
                                <div><strong>Data recebimento:</strong> {editDateTime(item.dataRecebimento)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {!isProcessing && (
                    <button onClick={onClose} className="importButton">
                        Concluir
                    </button>
                )}
            </div>
        </div>
    );
}
