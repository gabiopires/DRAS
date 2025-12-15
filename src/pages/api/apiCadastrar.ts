/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function Cadastrar(req: NextApiRequest, res: NextApiResponse){

  const { nome, referencia, endereco, action } = req.query;

  if(req.method === "GET"){
    if (action == "search"){
      try{
        const connection = await pool.getConnection();
        const [rows]:any[] = await connection.query(`
          SELECT ate.id AS idAtendimento,
            ate.dataRecebimento,
            ate.acolhimentoInstitucional,
            ate.dilacao,
            ate.dataDilacao,
            ate.orgaoEncaminhador,
            ate.referencia,
            ate.sigps,
            ate.finalizado,
            en.id AS idEncaminhamento,
            en.descricao AS encaminhamento,
            tec.id AS idTecnicoResponsavel,
            tec.nome AS tecnicoResponsavel,
            vio.id AS idViolacao,
            vio.descricao AS violacao,
            vul.id AS idVulnerabilidade,
            vul.descricao AS vulnerabilidade,
            pAte.id AS idPrazoAtendimento,
            pAte.descricao AS prazoAtendimento,
            ate.fimPrevistoAtendimento,
            ate.id_pessoa AS idPessoa,
            p.nome,
            p.identificacao,
            iden.id AS idTipoIdentificacao,
            iden.descricao AS tipoIdentificacao,
            p.endereco,
            p.sexo,
            p.referenciaFamiliar,
            p.deficiencia,
            p.situacaoRua,
            caU.id AS idCategoria,
            caU.descricao AS categoria,
            t.id AS idTerritorio,
            t.descricao AS territorio,
            cenSau.id AS idCentroSaude,
            cenSau.descricao AS centroSaude
          FROM atendimento ate
          LEFT JOIN pessoa p ON ate.id_pessoa = p.id
          LEFT JOIN categoriaUsuario caU ON p.id_categoriaUsuario = caU.id
          LEFT JOIN territorio t ON p.id_territorio = t.id
          LEFT JOIN encaminhamento en ON ate.id_encaminhamento = en.id
          LEFT JOIN tecnicoResponsavel tec ON ate.id_tecnicoResponsavel = tec.id
          LEFT JOIN tiposViolacao vio ON ate.id_violacao = vio.id
          LEFT JOIN tiposVulnerabilidade vul ON ate.id_tiposVulnerabilidade = vul.id
          LEFT JOIN prazoAtendimento pAte ON ate.id_prazoAtendimento = pAte.id
          LEFT JOIN tiposIdentificacao iden ON p.id_tiposIdentificacao = iden.id
          LEFT JOIN tiposCentroSaude cenSau ON p.id_centroSaude = cenSau.id
          WHERE p.nome LIKE CONCAT('%', ?, '%')
            AND p.endereco LIKE CONCAT('%', ?, '%')
            AND p.referenciaFamiliar LIKE CONCAT('%', ?, '%')
          ORDER BY ABS(DATEDIFF(ate.fimPrevistoAtendimento, NOW())) ASC;
          ;`,[nome, endereco, referencia]
        );
        connection.release();
        if (Array.isArray(rows) && rows.length > 0) {
          const person = rows
          const dataReturn = { person }
          return res.status(200).json(dataReturn)
        }
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }else if(action == "getInitData"){
      try{
        const connection = await pool.getConnection();
        const [rowsTerritorio]:any[] = await connection.query(`
          SELECT * FROM territorio;
          ;`,[]
        );
        const [rowsCategoria]:any[] = await connection.query(`
          SELECT * FROM categoriaUsuario;
          ;`,[]
        );
        const [rowsVulnerabilidade]:any[] = await connection.query(`
          SELECT * FROM tiposVulnerabilidade;
          ;`,[]
        );
        const [rowsViolacao]:any[] = await connection.query(`
          SELECT * FROM tiposViolacao;
          ;`,[]
        );
        const [rowsTecnico]:any[] = await connection.query(`
          SELECT * FROM tecnicoResponsavel;
          ;`,[]
        );
        const [rowsEncaminhamento]:any[] = await connection.query(`
          SELECT * FROM encaminhamento;
          ;`,[]
        );
        const [rowsPrazo]:any[] = await connection.query(`
          SELECT * FROM prazoAtendimento;
          ;`,[]
        );
        const [rowsIdentificacao]:any[] = await connection.query(`
          SELECT * FROM tiposIdentificacao;
          ;`,[]
        );
        const [rowsCentroSaude]:any[] = await connection.query(`
          SELECT * FROM tiposCentroSaude;
          ;`,[]
        );
        connection.release();
        if (Array.isArray(rowsCategoria) && rowsCategoria.length > 0) {
          const dataReturn = { 
            territorios:  rowsTerritorio,
            categorias: rowsCategoria,
            vulnerabilidades: rowsVulnerabilidade,
            violacao: rowsViolacao,
            tecnicoResponsavel: rowsTecnico,
            encaminhamento: rowsEncaminhamento,
            prazoAtendimento: rowsPrazo,
            tiposIdentificacao: rowsIdentificacao,
            centroSaude: rowsCentroSaude
          }
          return res.status(200).json(dataReturn)
        }
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }else if (req.method === "POST"){
    const { nome, territorio, sexo,identificacao,endereco,referenciaFamiliar,centroSaude,deficiencia,
      situacaoRua, categoria, dataRecebimento, tecnico, acolhimento, orgaoEncaminhador, referencia,
      vulnerabilidade, violacao,encaminhamento, sigps, prazoAtendimento, fimPrevisto, pessoaId, tipoIdentificacao
    } = req.body;


    if (action == "cadastrar"){
      let idPessoa: any;
      try{
        
        const connection = await pool.getConnection();
        const [rowsPessoa]: any[] = await connection.query(`
          INSERT INTO pessoa (
            nome, identificacao, endereco, sexo, referenciaFamiliar, deficiencia, situacaoRua,  
            id_categoriaUsuario, id_territorio, id_tiposIdentificacao, id_centroSaude
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          nome, identificacao, endereco, sexo, referenciaFamiliar, deficiencia, situacaoRua, 
          categoria, territorio, tipoIdentificacao, centroSaude
        ]);

        if(rowsPessoa.insertId && (rowsPessoa.affectedRows > 0)){
          idPessoa = rowsPessoa.insertId;

          const [rowsAtendimento]: any[] = await connection.query(`
            INSERT INTO atendimento (
              dataRecebimento, acolhimentoInstitucional, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, 
              id_pessoa, id_prazoAtendimento, id_encaminhamento, id_tecnicoResponsavel, id_violacao, id_tiposVulnerabilidade, fimPrevistoAtendimento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            dataRecebimento, acolhimento, "Não", null, orgaoEncaminhador, referencia, sigps, idPessoa, prazoAtendimento, encaminhamento,
            tecnico, violacao, vulnerabilidade, fimPrevisto
          ]);

          if(rowsAtendimento.insertId && (rowsAtendimento.affectedRows > 0)){
            connection.release();
            return res.status(201).json("Ok")
          }else{
            const [rowsPessoa]: any[] = await connection.query(`DELETE FROM pessoa WHERE id = ?`,[idPessoa]);
            console.log(rowsPessoa)
            connection.release();
            return res.status(500).json({ message: "Erro interno do servidor" });
          }
          
        }else{
          connection.release();
          return res.status(500).json({ message: "Erro interno do servidor" });
        }

      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
    
    
    else if (action == "cadastrarAtendimento"){
      try{
        const connection = await pool.getConnection();
        const [rowsAtendimento]: any[] = await connection.query(`
          INSERT INTO atendimento (
            dataRecebimento, acolhimentoInstitucional, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, 
            id_pessoa, id_prazoAtendimento, id_encaminhamento, id_tecnicoResponsavel, id_violacao, id_tiposVulnerabilidade, fimPrevistoAtendimento
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          dataRecebimento, acolhimento, "Não", null, orgaoEncaminhador, referencia, sigps, pessoaId, prazoAtendimento, encaminhamento,
          tecnico, violacao, vulnerabilidade, fimPrevisto
        ]);
        console.log(rowsAtendimento)
        connection.release();
        return res.status(201).json("Ok")
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }
  
  
  else if (req.method === "PUT"){
    const { nome, territorio, sexo,identificacao,endereco,referenciaFamiliar,centroSaude,deficiencia,
      situacaoRua, categoria, tecnico, acolhimento, orgaoEncaminhador, referencia,
      vulnerabilidade, violacao,encaminhamento, sigps, dilacao, dataDilacao, idPessoa, idAtendimento, finalizar
    } = req.body;
    if (action == "editar"){
      try{
        const connection = await pool.getConnection();
        const [rowsPessoa]: any[] = await connection.query(`
          UPDATE pessoa SET
            nome = ?, endereco = ?, referenciaFamiliar = ?, centroSaude = ?, deficiencia = ?, situacaoRua = ?, sexo = ?, 
            identificacao = ?, id_categoriaUsuario = ?, id_territorio = ?
          WHERE id = ?`, [
          nome, endereco, referenciaFamiliar, centroSaude, deficiencia, situacaoRua, sexo,
          identificacao, categoria, territorio, idPessoa
        ]);
        console.log(rowsPessoa)
        const [rowsAtendimento]: any[] = await connection.query(`
          UPDATE atendimento SET
            acolhimentoInstitucional = ?, dilacao = ?, dataDilacao = ?, orgaoEncaminhador = ?, referencia = ?, sigps = ?, 
            id_encaminhamento = ?, id_tecnicoResponsavel = ?, id_violacao = ?, id_tiposVulnerabilidade = ?
          WHERE id = ?`, [
          acolhimento, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, encaminhamento,
          tecnico, violacao, vulnerabilidade, idAtendimento
        ]);
        console.log(rowsAtendimento)
        connection.release();
        return res.status(201).json("Ok")
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }else if (action == "finalizar"){
      try{
        const connection = await pool.getConnection();
        const [rowsAtendimento]: any[] = await connection.query(`UPDATE atendimento SET finalizado = ? WHERE id = ?`,[finalizar, idAtendimento]);
        console.log(rowsAtendimento)
        connection.release();
        return res.status(201).json("Ok")
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }else if (req.method === "DELETE"){
    const { idPessoa, idAtendimento } = req.body;
    if (action == "excluir"){
      try{
        const connection = await pool.getConnection();
        
        const [rowsAtendimento]: any[] = await connection.query(`DELETE FROM atendimento WHERE id = ?`,[idAtendimento]);
        console.log(rowsAtendimento)
        connection.release();
        return res.status(201).json("Ok")
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }else{
    return res.status(405).json({ message: "Method unauthorized" });
  }
}
