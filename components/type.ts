export type TypeDataAlerts = {
    alertText: string,
    alertButtons: string[],
    alertsCommans: (()=> void)[],
}

export type TypePessoa = {
    idAtendimento: number,
    idPessoa: number,
    nome: string,
    idTipoIdentificacao: number,
    identificacao: string,
    endereco: string,
    sexo: string,
    centroSaude: string,
    idCentroSaude: number,
    referenciaFamiliar: string,
    deficiencia: string,
    situacaoRua: string,
    idCategoria: number,
    categoria: string,
    idTerritorio: number,
    territorio: string,
    dataRecebimento: string,
    acolhimentoInstitucional: string,
    dilacao: string,
    dataDilacao: string,
    orgaoEncaminhador: string,
    referencia: string,
    sigps: string,
    idEncaminhamento: number,
    encaminhamento: string,
    idTecnicoResponsavel: number,
    tecnicoResponsavel: string,
    idViolacao: number,
    violacao: string,
    idVulnerabilidade: number,
    vulnerabilidade: string,
    idPrazoAtendimento: number,
    prazoAtendimento: string,
    fimPrevistoAtendimento:string
}

export type ExcelRow = {
    acolhimentoInstitucional: string;
    idCentroSaude: number;
    dataRecebimento: number | string;
    deficiencia: string;
    dilacao: string;
    endereco: string;
    idCategoria: number;
    idEncaminhamento: number;
    idPrazoAtendimento: number;
    idTerritorio: number;
    idViolacao: number;
    idVulnerabilidade: number;
    identificacao: number | string;
    idTipoIdentificacao: number;
    nome: string;
    orgaoEncaminhador: string;
    referencia: string;
    referenciaFamiliar: string;
    sexo: string;
    sigps: string;
    situacaoRua: string;
    __rowNum__?: number;
};

export type ApiPayload = {
    nome: string;
    territorio: number;
    sexo: string;
    identificacao: string;
    tipoIdentificacao: number;
    endereco: string;
    referenciaFamiliar: string;
    centroSaude: number;
    deficiencia: string;
    situacaoRua: string;
    categoria: number;
    dataRecebimento: string;
    tecnico: number | null;
    acolhimento: string;
    orgaoEncaminhador: string;
    referencia: string;
    vulnerabilidade: number;
    violacao: number;
    encaminhamento: number;
    sigps: string;
    prazoAtendimento: number;
    fimPrevisto?: string | null;
};

export type ImportResult = ApiPayload & {
  status: "concluido" | "erro";
};

export type TypeUsuario ={
    id: number,
    nome: string,
    email: string,
    endereco: string,
    telefone: string,
    senha: string,
    tipo: string
}