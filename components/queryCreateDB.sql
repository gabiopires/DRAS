CREATE DATABASE  IF NOT EXISTS `dras` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dras`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dras
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atendimento`
--

DROP TABLE IF EXISTS `atendimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atendimento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dataRecebimento` date DEFAULT NULL,
  `acolhimentoInstitucional` varchar(255) DEFAULT NULL,
  `dilacao` varchar(255) DEFAULT NULL,
  `dataDilacao` date DEFAULT NULL,
  `orgaoEncaminhador` varchar(255) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `sigps` varchar(255) DEFAULT NULL,
  `id_pessoa` int NOT NULL,
  `id_prazoAtendimento` int NOT NULL,
  `id_encaminhamento` int NOT NULL,
  `id_tecnicoResponsavel` int DEFAULT NULL,
  `id_violacao` int DEFAULT NULL,
  `id_tiposVulnerabilidade` int DEFAULT NULL,
  `fimPrevistoAtendimento` date DEFAULT NULL,
  `finalizado` varchar(45) DEFAULT 'Não',
  PRIMARY KEY (`id`),
  KEY `id_pessoa` (`id_pessoa`),
  KEY `id_prazoAtendimento` (`id_prazoAtendimento`),
  KEY `id_encaminhamento` (`id_encaminhamento`),
  KEY `atendimento_ibfk_4_idx` (`id_tecnicoResponsavel`),
  KEY `atendimento_ibfk_5_idx` (`id_violacao`),
  KEY `atendimento_ibfk_6_idx` (`id_tiposVulnerabilidade`),
  CONSTRAINT `atendimento_ibfk_1` FOREIGN KEY (`id_pessoa`) REFERENCES `pessoa` (`id`),
  CONSTRAINT `atendimento_ibfk_2` FOREIGN KEY (`id_prazoAtendimento`) REFERENCES `prazoatendimento` (`id`),
  CONSTRAINT `atendimento_ibfk_3` FOREIGN KEY (`id_encaminhamento`) REFERENCES `encaminhamento` (`id`),
  CONSTRAINT `atendimento_ibfk_4` FOREIGN KEY (`id_tecnicoResponsavel`) REFERENCES `tecnicoresponsavel` (`id`),
  CONSTRAINT `atendimento_ibfk_5` FOREIGN KEY (`id_violacao`) REFERENCES `tiposviolacao` (`id`),
  CONSTRAINT `atendimento_ibfk_6` FOREIGN KEY (`id_tiposVulnerabilidade`) REFERENCES `tiposvulnerabilidade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atendimento`
--

LOCK TABLES `atendimento` WRITE;
/*!40000 ALTER TABLE `atendimento` DISABLE KEYS */;
INSERT INTO `atendimento` VALUES (70,'2025-12-10','Não possui','Sim','2025-12-15','Não possui','Não possui','Não possui',85,1,1,1,5,1,NULL,'Não'),(71,'2025-12-10','Não possui','Sim','2025-12-15','Não possui','Não possui','Não possui',85,1,1,1,1,1,NULL,'Não'),(72,'2025-12-11','a','Não',NULL,'a','a','a',86,2,2,2,7,2,NULL,'Não'),(73,'2025-12-11','a','Não',NULL,'a','a','a',87,2,2,2,2,2,NULL,'Não'),(74,'2025-12-10','Não possui','Não',NULL,'Não possui','Não possui','Não possui',88,1,1,NULL,1,1,NULL,'Não'),(75,'2025-12-10','Não possui','Não',NULL,'Não possui','Não possui','Não possui',89,1,1,NULL,1,1,NULL,'Não');
/*!40000 ALTER TABLE `atendimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriausuario`
--

DROP TABLE IF EXISTS `categoriausuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriausuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriausuario`
--

LOCK TABLES `categoriausuario` WRITE;
/*!40000 ALTER TABLE `categoriausuario` DISABLE KEYS */;
INSERT INTO `categoriausuario` VALUES (1,'criança/adolescente'),(2,'adulto'),(3,'idoso');
/*!40000 ALTER TABLE `categoriausuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encaminhamento`
--

DROP TABLE IF EXISTS `encaminhamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encaminhamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encaminhamento`
--

LOCK TABLES `encaminhamento` WRITE;
/*!40000 ALTER TABLE `encaminhamento` DISABLE KEYS */;
INSERT INTO `encaminhamento` VALUES (1,'CREAS'),(2,'CPSC-B'),(3,'CRAS Petropolis'),(4,'CRAS Independencia'),(5,'CRAS Vila Cemig');
/*!40000 ALTER TABLE `encaminhamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `identificacao` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `referenciaFamiliar` varchar(255) DEFAULT NULL,
  `deficiencia` varchar(255) DEFAULT NULL,
  `situacaoRua` varchar(5) DEFAULT NULL,
  `id_categoriaUsuario` int NOT NULL,
  `id_territorio` int NOT NULL,
  `id_tiposIdentificacao` int NOT NULL,
  `id_centroSaude` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_categoriaUsuario` (`id_categoriaUsuario`),
  KEY `id_territorio` (`id_territorio`),
  KEY `pessoa_ibfk_3_idx` (`id_tiposIdentificacao`),
  KEY `pessoa_ibfk_4_idx` (`id_centroSaude`),
  CONSTRAINT `pessoa_ibfk_1` FOREIGN KEY (`id_categoriaUsuario`) REFERENCES `categoriausuario` (`id`),
  CONSTRAINT `pessoa_ibfk_2` FOREIGN KEY (`id_territorio`) REFERENCES `territorio` (`id`),
  CONSTRAINT `pessoa_ibfk_3` FOREIGN KEY (`id_tiposIdentificacao`) REFERENCES `tiposidentificacao` (`id`),
  CONSTRAINT `pessoa_ibfk_4` FOREIGN KEY (`id_centroSaude`) REFERENCES `tiposcentrosaude` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES (84,'Gabrielle Oliveira Pires','1','a','F','Marcos Pires','Não','Não',2,1,1,1),(85,'Gabrielle Oliveira Pires','1','a','F','Marcos Pires','Não','Não',2,2,1,1),(86,'a','a','a','F','a','Não','Não',2,1,9,14),(87,'a','a','a','F','a','Sim','Sim',2,3,1,14),(88,'Joao','1','Não possui','M','Não possui','Não','Não',1,1,1,1),(89,'Joao','1','Não possui','M','Não possui','Não','Não',1,1,1,1);
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prazoatendimento`
--

DROP TABLE IF EXISTS `prazoatendimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prazoatendimento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prazoatendimento`
--

LOCK TABLES `prazoatendimento` WRITE;
/*!40000 ALTER TABLE `prazoatendimento` DISABLE KEYS */;
INSERT INTO `prazoatendimento` VALUES (1,'10'),(2,'15'),(3,'20'),(4,'25'),(5,'30');
/*!40000 ALTER TABLE `prazoatendimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tecnicoresponsavel`
--

DROP TABLE IF EXISTS `tecnicoresponsavel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tecnicoresponsavel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tecnicoresponsavel`
--

LOCK TABLES `tecnicoresponsavel` WRITE;
/*!40000 ALTER TABLE `tecnicoresponsavel` DISABLE KEYS */;
INSERT INTO `tecnicoresponsavel` VALUES (1,'Ludmilla'),(2,'Henrique');
/*!40000 ALTER TABLE `tecnicoresponsavel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `territorio`
--

DROP TABLE IF EXISTS `territorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `territorio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `territorio`
--

LOCK TABLES `territorio` WRITE;
/*!40000 ALTER TABLE `territorio` DISABLE KEYS */;
INSERT INTO `territorio` VALUES (1,'B1'),(2,'B2'),(3,'B3'),(4,'B4'),(5,'B5');
/*!40000 ALTER TABLE `territorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposcentrosaude`
--

DROP TABLE IF EXISTS `tiposcentrosaude`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposcentrosaude` (
  `id` int NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposcentrosaude`
--

LOCK TABLES `tiposcentrosaude` WRITE;
/*!40000 ALTER TABLE `tiposcentrosaude` DISABLE KEYS */;
INSERT INTO `tiposcentrosaude` VALUES (1,'Centro de Saúde Barreiro de Cima'),(2,'Centro de Saúde Bonsucesso'),(3,'Centro de Saúde Carlos Renato Dias'),(4,'Centro de Saúde Diamante/Teixeira Dias'),(5,'Centro de Saúde Dr. José Domingos (antigo Bairro das Indústrias)'),(6,'Centro de Saúde Eduardo Mauro de Araújo (Miramar)'),(7,'Centro de Saúde Francisco Gomes Barbosa (Tirol)'),(8,'Centro de Saúde Independência'),(9,'Centro de Saúde Itaipu/Jatobá'),(10,'Centro de Saúde Lisandra Angélica David Justino/Túnel de Ibirité'),(11,'Centro de Saúde Maria Madalena Teodoro - Lindeia'),(12,'Centro de Saúde Mangueiras'),(13,'Centro de Saúde Milionário'),(14,'Centro de Saúde Pilar/Olhos D\'Agua'),(15,'Centro de Saúde Regina'),(16,'Centro de Saúde Santa Cecília'),(17,'Centro de Saúde Urucuia'),(18,'Centro de Saúde Vale do Jatobá'),(19,'Centro de Saúde Vila Cemig'),(20,'Centro de Saúde Vila Pinho');
/*!40000 ALTER TABLE `tiposcentrosaude` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposidentificacao`
--

DROP TABLE IF EXISTS `tiposidentificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposidentificacao` (
  `id` int NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposidentificacao`
--

LOCK TABLES `tiposidentificacao` WRITE;
/*!40000 ALTER TABLE `tiposidentificacao` DISABLE KEYS */;
INSERT INTO `tiposidentificacao` VALUES (1,'CPF'),(2,'RG'),(3,'CTPS'),(4,'CNS'),(5,'PIS/NIS/NIT'),(6,'CNH'),(7,'Passaporte'),(8,'Titulo Eleitoral'),(9,'Não informado');
/*!40000 ALTER TABLE `tiposidentificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposviolacao`
--

DROP TABLE IF EXISTS `tiposviolacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposviolacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposviolacao`
--

LOCK TABLES `tiposviolacao` WRITE;
/*!40000 ALTER TABLE `tiposviolacao` DISABLE KEYS */;
INSERT INTO `tiposviolacao` VALUES (1,'física'),(2,'psicológica'),(3,'moral'),(4,'sexual'),(5,'patrimonial'),(6,'Negligência'),(7,'Abandono'),(8,'Assédio'),(9,'institucional');
/*!40000 ALTER TABLE `tiposviolacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposvulnerabilidade`
--

DROP TABLE IF EXISTS `tiposvulnerabilidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposvulnerabilidade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposvulnerabilidade`
--

LOCK TABLES `tiposvulnerabilidade` WRITE;
/*!40000 ALTER TABLE `tiposvulnerabilidade` DISABLE KEYS */;
INSERT INTO `tiposvulnerabilidade` VALUES (1,'Socioeconômica'),(2,'Territorial'),(3,'Familiar'),(4,'Juvenil'),(5,'violência'),(6,'saúde');
/*!40000 ALTER TABLE `tiposvulnerabilidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) DEFAULT NULL,
  `Nome` varchar(255) NOT NULL,
  `Endereco` varchar(255) DEFAULT NULL,
  `Telefone` varchar(255) DEFAULT NULL,
  `Senha` varchar(255) NOT NULL,
  `Tipo` enum('Administrador','Atendente') NOT NULL DEFAULT 'Atendente',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'gabi@gmail.com','Gabrielle','rua a','3133333333','12345','Administrador'),(2,'ingrid@gmail.com','Ingrid','rua a','(31) 3333-3333','12345','Administrador');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 22:25:12
