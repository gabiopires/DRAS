/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';
import jwt from 'jsonwebtoken';

export default async function Cadastrar(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.auth_token;
  const { action } = req.query;

  //Validação de Autenticação
  if (!token) {
    return res.status(401).json({ message: "Acesso não autorizado. Faça login." });
  }

  let usuarioLogado: any;
  try {
    const JWT_SECRET = String(process.env.JWT_SECRET);
    usuarioLogado = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    //MÉTODOS GET
    if (req.method === "GET") {
      if (action === "search") {
        const { nome, endereco, referencia } = req.query;
        const [rows]: any[] = await connection.query(`
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
          ;`, [nome, endereco, referencia]);
        
        connection.release();
        return res.status(200).json({ person: rows });

      }else if(action === "getInitData") {
        const [ [territorios], [categorias], [vulnerabilidades], [violacao], [tecnicoResponsavel], [encaminhamento], [prazoAtendimento], [tiposIdentificacao], [centroSaude]] =
        await Promise.all([
          connection.query(`SELECT * FROM territorio`),
          connection.query(`SELECT * FROM categoriaUsuario`),
          connection.query(`SELECT * FROM tiposVulnerabilidade`),
          connection.query(`SELECT * FROM tiposViolacao`),
          connection.query(`SELECT * FROM tecnicoResponsavel`),
          connection.query(`SELECT * FROM encaminhamento`),
          connection.query(`SELECT * FROM prazoAtendimento`),
          connection.query(`SELECT * FROM tiposIdentificacao`),
          connection.query(`SELECT * FROM tiposCentroSaude`)
        ]);

        connection.release();
        return res.status(200).json({
          territorios, categorias, vulnerabilidades, violacao, tecnicoResponsavel,
          encaminhamento, prazoAtendimento, tiposIdentificacao, centroSaude
        });
      }
    }

    //MÉTODOS POST
    else if (req.method === "POST") {
      const { nome, territorio, sexo, identificacao, endereco, referenciaFamiliar, centroSaude, deficiencia, situacaoRua, categoria, dataRecebimento, tecnico, acolhimento, orgaoEncaminhador, 
        referencia, vulnerabilidade, violacao, encaminhamento, sigps, prazoAtendimento, fimPrevisto, pessoaId, tipoIdentificacao 
      } = req.body;

      //cADASTRO DE UM NOVO PACIENTE
      if (action === "cadastrar") {
        await connection.beginTransaction();

        try {
          const [rowsPessoa]: any = await connection.query(`
            INSERT INTO pessoa ( nome, identificacao, endereco, sexo, referenciaFamiliar, deficiencia, situacaoRua, id_categoriaUsuario, id_territorio, id_tiposIdentificacao, id_centroSaude
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [nome, identificacao, endereco, sexo, referenciaFamiliar, deficiencia, situacaoRua, categoria, territorio, tipoIdentificacao, centroSaude]
          );

          const idPessoa = rowsPessoa.insertId;

          await connection.query(`
            INSERT INTO atendimento (
              dataRecebimento, acolhimentoInstitucional, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, 
              id_pessoa, id_prazoAtendimento, id_encaminhamento, id_tecnicoResponsavel, id_violacao, id_tiposVulnerabilidade, fimPrevistoAtendimento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [dataRecebimento, acolhimento, "Não", null, orgaoEncaminhador, referencia, sigps, idPessoa, prazoAtendimento, encaminhamento, tecnico, violacao, vulnerabilidade, fimPrevisto]
          );

          // Se deu tudo certo, consolida as duas inserções no banco
          await connection.commit();
          connection.release();
          return res.status(201).json("Ok");

        } catch (transactionError) {
          // Se qualquer um dos INSERTs falhar, desfaz tudo automaticamente
          await connection.rollback();
          throw transactionError;
        }
        
      }
      //CADASTRO DE UM NOVO ATENDIMENTO PARA UM PACIENTE EXISTENTE
      else if (action === "cadastrarAtendimento") {
        await connection.query(`
          INSERT INTO atendimento (
            dataRecebimento, acolhimentoInstitucional, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, 
            id_pessoa, id_prazoAtendimento, id_encaminhamento, id_tecnicoResponsavel, id_violacao, id_tiposVulnerabilidade, fimPrevistoAtendimento
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
          [dataRecebimento, acolhimento, "Não", null, orgaoEncaminhador, referencia, sigps, pessoaId, prazoAtendimento, encaminhamento, tecnico, violacao, vulnerabilidade, fimPrevisto]
        );
        connection.release();
        return res.status(201).json("Ok");
      }
    }

    // MÉTODO PUT
    else if (req.method === "PUT") {
      const { nome, territorio, sexo, identificacao, endereco, referenciaFamiliar, centroSaude, deficiencia, situacaoRua, categoria, tecnico, acolhimento, orgaoEncaminhador, referencia,
        vulnerabilidade, violacao, encaminhamento, sigps, dilacao, dataDilacao, idPessoa, idAtendimento, finalizar
      } = req.body;

      //EDITA UM ATENDIMENTO EXISTENTE
      if (action === "editar") {
        await connection.query(`
          UPDATE pessoa SET nome = ?, endereco = ?, referenciaFamiliar = ?, id_centroSaude = ?, deficiencia = ?, situacaoRua = ?, sexo = ?, identificacao = ?, id_categoriaUsuario = ?, id_territorio = ?
          WHERE id = ?`, 
          [nome, endereco, referenciaFamiliar, centroSaude, deficiencia, situacaoRua, sexo, identificacao, categoria, territorio, idPessoa]
        );

        await connection.query(`
          UPDATE atendimento SET acolhimentoInstitucional = ?, dilacao = ?, dataDilacao = ?, orgaoEncaminhador = ?, referencia = ?, sigps = ?, id_encaminhamento = ?, id_tecnicoResponsavel = ?, id_violacao = ?, id_tiposVulnerabilidade = ?
          WHERE id = ?`, 
          [acolhimento, dilacao, dataDilacao, orgaoEncaminhador, referencia, sigps, encaminhamento, tecnico, violacao, vulnerabilidade, idAtendimento]
        );
        connection.release();
        return res.status(201).json("Ok");

      } 
      //FINALIZA UM ATENDIMENTO EXISTENTE
      else if (action === "finalizar") {
        await connection.query(`UPDATE atendimento SET finalizado = ? WHERE id = ?`, [finalizar, idAtendimento]);
        connection.release();
        return res.status(201).json("Ok");
      }
    }

    // MÉTODO DELETE
    else if (req.method === "DELETE") {
      if (action === "excluir") {
        //Apenas admins pode deletar
        if (usuarioLogado.tipo !== 'Administrador') {
          connection.release();
          return res.status(403).json({ message: "Apenas admins podem excluir registros." });
        }

        //DELETA UM ATENDIMENTO EXISTENTE MAS NÃO DELETA UM PACIENTE
        const { idAtendimento } = req.body;
        await connection.query(`DELETE FROM atendimento WHERE id = ?`, [idAtendimento]);
        connection.release();
        return res.status(200).json("Ok");
      }
    }

    connection.release();
    // Se a rota/ação não foi encontrada
    return res.status(400).json({ message: "Ação inválida ou método incorreto." });

  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}