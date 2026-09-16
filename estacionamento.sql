-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 16-Set-2026 às 19:08
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `estacionamento`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `bilhete`
--

CREATE TABLE `bilhete` (
  `id_bilhete` int(11) NOT NULL,
  `hora_entrada_bilhete` datetime NOT NULL,
  `hora_saida_bilhete` datetime DEFAULT NULL,
  `valor_bilhete` decimal(4,2) DEFAULT NULL,
  `status_bilhete` varchar(45) NOT NULL,
  `Veiculo_id_veiculo` int(11) NOT NULL,
  `Vaga_id_vaga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `bilhete`
--

INSERT INTO `bilhete` (`id_bilhete`, `hora_entrada_bilhete`, `hora_saida_bilhete`, `valor_bilhete`, `status_bilhete`, `Veiculo_id_veiculo`, `Vaga_id_vaga`) VALUES
(1, '2026-09-11 07:12:43', '2026-09-11 09:18:48', 8.00, 'Ocupado', 2, 1),
(2, '2026-09-11 09:14:43', NULL, NULL, 'Ocupado', 1, 2),
(3, '2026-09-11 09:16:20', NULL, NULL, 'Ocupado', 3, 4),
(4, '2026-09-01 08:00:00', '2026-09-01 10:00:00', 16.00, 'Finalizado', 4, 1),
(5, '2026-09-01 09:30:00', '2026-09-01 12:30:00', 24.00, 'Finalizado', 5, 2),
(6, '2026-09-02 14:00:00', '2026-09-02 17:00:00', 24.00, 'Finalizado', 6, 3),
(7, '2026-09-02 10:15:00', '2026-09-02 11:15:00', 8.00, 'Finalizado', 7, 4),
(8, '2026-09-03 08:00:00', '2026-09-03 13:00:00', 40.00, 'Finalizado', 8, 5),
(9, '2026-09-03 13:00:00', '2026-09-03 15:00:00', 16.00, 'Finalizado', 9, 6),
(10, '2026-09-04 07:45:00', '2026-09-04 11:45:00', 32.00, 'Finalizado', 10, 7),
(11, '2026-09-04 14:20:00', '2026-09-04 16:20:00', 16.00, 'Finalizado', 11, 8),
(12, '2026-09-05 09:00:00', '2026-09-05 10:00:00', 8.00, 'Finalizado', 12, 9),
(13, '2026-09-05 11:00:00', '2026-09-05 15:00:00', 32.00, 'Finalizado', 13, 10),
(14, '2026-09-06 08:30:00', '2026-09-06 10:30:00', 16.00, 'Finalizado', 14, 11),
(15, '2026-09-06 13:10:00', '2026-09-06 16:10:00', 24.00, 'Finalizado', 15, 12),
(16, '2026-09-07 10:00:00', '2026-09-07 12:00:00', 16.00, 'Finalizado', 16, 13),
(17, '2026-09-07 14:00:00', '2026-09-07 18:00:00', 32.00, 'Finalizado', 17, 14),
(18, '2026-09-08 08:00:00', '2026-09-08 11:00:00', 24.00, 'Finalizado', 18, 15),
(19, '2026-09-08 13:00:00', '2026-09-08 17:00:00', 32.00, 'Finalizado', 19, 16),
(20, '2026-09-09 09:00:00', '2026-09-09 12:00:00', 24.00, 'Finalizado', 20, 17),
(21, '2026-09-09 14:30:00', '2026-09-09 15:30:00', 8.00, 'Finalizado', 21, 18),
(22, '2026-09-10 08:15:00', '2026-09-10 12:15:00', 32.00, 'Finalizado', 22, 19),
(23, '2026-09-10 13:00:00', '2026-09-10 16:00:00', 24.00, 'Finalizado', 23, 20),
(24, '2026-09-10 16:30:00', '2026-09-10 18:30:00', 16.00, 'Finalizado', 24, 21),
(25, '2026-09-11 07:00:00', '2026-09-11 09:00:00', 16.00, 'Finalizado', 25, 22),
(26, '2026-09-11 08:00:00', '2026-09-11 11:00:00', 24.00, 'Finalizado', 26, 23),
(27, '2026-09-11 08:30:00', NULL, NULL, 'Ocupado', 27, 24),
(28, '2026-09-11 09:00:00', NULL, NULL, 'Ocupado', 28, 25),
(29, '2026-09-11 09:15:00', NULL, NULL, 'Ocupado', 29, 26),
(30, '2026-09-11 10:00:00', NULL, NULL, 'Ocupado', 30, 27),
(31, '2026-09-11 10:30:00', NULL, NULL, 'Ocupado', 31, 28),
(32, '2026-09-11 11:00:00', NULL, NULL, 'Ocupado', 32, 29),
(33, '2026-09-11 11:15:00', NULL, NULL, 'Ocupado', 33, 30);

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nome_cliente` varchar(45) NOT NULL,
  `cpf_cliente` varchar(45) NOT NULL,
  `telefone_cliente` varchar(45) NOT NULL,
  `endereco_cliente` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `nome_cliente`, `cpf_cliente`, `telefone_cliente`, `endereco_cliente`) VALUES
(1, 'Guilherme Thales Enrico Cardoso', '813.644.769-16', '(47) 99105-6072', 'Rua Marechal Rondon, 824 - Jardim América, Rio do Sul - SC'),
(2, 'Julia Rayssa Luzia Nogueira', '630.288.049-13', '(47) 99387-1413', 'Rua Raulino Dolzan, 168 - Jardim América, Rio do Sul - SC'),
(4, 'João Fábio Daniel Nunes', '770.042.909-05', '(47) 98280-2491', 'Rua Raulino Dolzan, 167 - Jardim América, Rio do Sul - SC'),
(5, 'Ana Paula Silva', '123.456.789-01', '(47) 99111-2233', 'Rua XV de Novembro, 100, Centro, Rio do Sul - SC'),
(6, 'Carlos Eduardo Santos', '234.567.890-12', '(47) 99222-3344', 'Alameda Aristiliano Ramos, 450, Centro, Rio do Sul - SC'),
(7, 'Mariana Oliveira Rocha', '345.678.901-23', '(47) 99333-4455', 'Rua dos Atiradores, 12, Bela Vista, Rio do Sul - SC'),
(8, 'Lucas Gabriel Ferreira', '456.789.012-34', '(47) 99444-5566', 'Rua São José, 88, Budag, Rio do Sul - SC'),
(9, 'Beatriz Lima Souza', '567.890.123-45', '(47) 99555-6677', 'Rua Coelho Neto, 301, Canta Galo, Rio do Sul - SC'),
(10, 'Rafael Alves Costa', '678.901.234-56', '(47) 99666-7788', 'Rua Humaitá, 55, Santana, Rio do Sul - SC'),
(11, 'Camila Rodrigues Martins', '789.012.345-67', '(47) 99777-8899', 'Rua XV de Novembro, 820, Centro, Rio do Sul - SC'),
(12, 'Thiago Henrique Pereira', '890.123.456-78', '(47) 99888-9900', 'Rua Dom Pedro II, 14, Taboão, Rio do Sul - SC'),
(13, 'Fernanda Barbosa Lima', '901.234.567-89', '(47) 99999-0011', 'Rua Marechal Deodoro, 400, Eugenio Melo, Rio do Sul - SC'),
(14, 'Bruno Castro Ribeiro', '012.345.678-90', '(47) 99000-1122', 'Rua das Missões, 150, Fundo Canoas, Rio do Sul - SC'),
(15, 'Juliana Carvalho Dias', '112.233.445-56', '(47) 98811-2233', 'Rua São João, 90, Laranjeiras, Rio do Sul - SC'),
(16, 'Diego Ramos Araujo', '223.344.556-67', '(47) 98822-3344', 'Rua Ruy Barbosa, 210, Sumaré, Rio do Sul - SC'),
(17, 'Amanda Fernandes Melo', '334.455.667-78', '(47) 98833-4455', 'Rua Presidente Kennedy, 50, Jardim América, Rio do Sul - SC'),
(18, 'Felipe Augusto Correia', '445.566.778-89', '(47) 98844-5566', 'Rua 7 de Setembro, 330, Centro, Rio do Sul - SC'),
(19, 'Larissa Martins Gomes', '556.677.889-90', '(47) 98855-6677', 'Rua Wenceslau Braz, 77, Canta Galo, Rio do Sul - SC'),
(20, 'Rodrigo Teixeira Pinto', '667.788.990-01', '(47) 98866-7788', 'Rua Oscar Barreto, 105, Budag, Rio do Sul - SC'),
(21, 'Patricia Azevedo Moreira', '778.899.001-12', '(47) 98877-8899', 'Rua Princesa Isabel, 60, Santana, Rio do Sul - SC'),
(22, 'Gustavo Barbosa Vieira', '889.900.112-23', '(47) 98888-9900', 'Rua das Palmeiras, 19, Bela Vista, Rio do Sul - SC'),
(23, 'Aline Cardoso Mendes', '990.011.223-34', '(47) 98899-0011', 'Rua do Rosario, 404, Canoas, Rio do Sul - SC'),
(24, 'Marcelo Ribeiro Machado', '001.122.334-45', '(47) 98711-2233', 'Rua Tuiuti, 88, Centro, Rio do Sul - SC'),
(25, 'Vanessa Duarte Fonseca', '122.334.455-56', '(47) 98722-3344', 'Rua Santa Maria, 123, Taboão, Rio do Sul - SC'),
(26, 'Leonardo Monteiro Freitas', '233.445.566-67', '(47) 98733-4455', 'Rua São Paulo, 67, Jardim América, Rio do Sul - SC'),
(27, 'Gabriela Cavalcanti Marques', '344.556.677-78', '(47) 98744-5566', 'Rua Tiradentes, 89, Canta Galo, Rio do Sul - SC'),
(28, 'Matheus Nunes Peixoto', '455.667.788-89', '(47) 98755-6677', 'Rua Anita Garibaldi, 230, Budag, Rio do Sul - SC'),
(29, 'Letícia Barros Farias', '566.778.899-90', '(47) 98766-7788', 'Rua Duque de Caxias, 11, Santana, Rio do Sul - SC'),
(30, 'Vinícius Rocha Nogueira', '677.889.900-01', '(47) 98777-8899', 'Rua São Pedro, 305, Bela Vista, Rio do Sul - SC'),
(31, 'Carolina Franco Campos', '788.990.011-12', '(47) 98788-9900', 'Rua Amazonas, 512, Centro, Rio do Sul - SC'),
(32, 'Eduardo Correia Sales', '899.001.122-23', '(47) 98799-0011', 'Rua Paraná, 99, Eugênio Melo, Rio do Sul - SC'),
(33, 'Isabela Aguiar Castro', '900.112.233-34', '(47) 98611-2233', 'Rua Rio de Janeiro, 14, Fundo Canoas, Rio do Sul - SC'),
(34, 'Samuel Mota Silveira', '011.223.344-45', '(47) 98622-3344', 'Rua Santa Catarina, 78, Laranjeiras, Rio do Sul - SC');

-- --------------------------------------------------------

--
-- Estrutura da tabela `vaga`
--

CREATE TABLE `vaga` (
  `id_vaga` int(11) NOT NULL,
  `numero_vaga` int(7) NOT NULL,
  `tipo_vaga` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `vaga`
--

INSERT INTO `vaga` (`id_vaga`, `numero_vaga`, `tipo_vaga`) VALUES
(1, 1, 'PCD'),
(2, 2, 'Vaga Comum'),
(3, 3, 'Vaga Comum'),
(4, 4, 'Vaga Comum'),
(5, 5, 'Vaga Comum'),
(6, 6, 'Vaga Comum'),
(7, 7, 'Vaga Comum'),
(8, 8, 'Vaga Comum'),
(9, 9, 'Vaga Comum'),
(10, 10, 'PCD'),
(11, 11, 'Vaga Comum'),
(12, 12, 'Vaga Comum'),
(13, 13, 'Vaga Comum'),
(14, 14, 'Vaga Comum'),
(15, 15, 'Vaga Comum'),
(16, 16, 'Vaga Comum'),
(17, 17, 'Vaga Comum'),
(18, 18, 'Vaga Comum'),
(19, 19, 'Vaga Comum'),
(20, 20, 'PCD'),
(21, 21, 'Vaga Comum'),
(22, 22, 'Vaga Comum'),
(23, 23, 'Vaga Comum'),
(24, 24, 'Vaga Comum'),
(25, 25, 'Vaga Comum'),
(26, 26, 'Vaga Comum'),
(27, 27, 'Vaga Comum'),
(28, 28, 'Vaga Comum'),
(29, 29, 'Vaga Comum'),
(30, 30, 'Vaga Comum');

-- --------------------------------------------------------

--
-- Estrutura da tabela `veiculo`
--

CREATE TABLE `veiculo` (
  `id_veiculo` int(11) NOT NULL,
  `placa_veiculo` varchar(7) NOT NULL,
  `marca_modelo_veiculo` varchar(45) DEFAULT NULL,
  `cor_veiculo` varchar(45) DEFAULT NULL,
  `Cliente_id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `veiculo`
--

INSERT INTO `veiculo` (`id_veiculo`, `placa_veiculo`, `marca_modelo_veiculo`, `cor_veiculo`, `Cliente_id_cliente`) VALUES
(1, 'MMK-354', 'MINI COOPER 1.6 Aut.', 'Branco', 2),
(2, 'LWW-126', 'Troller T-4 DESERT STORM 4x4 3.0 TB Int Diese', 'Bege', 4),
(3, 'LXF-928', 'Citroen C3 Exclusive 1.5 Flex 8V 5p Mec.', 'Prata', 1),
(4, 'QHA-102', 'Chevrolet Onix 1.0', 'Preto', 5),
(5, 'MJK-482', 'Hyundai HB20 1.6', 'Branco', 6),
(6, 'RTA-9B1', 'Volkswagen Polo 1.0', 'Cinza', 7),
(7, 'OKD-339', 'Fiat Argo 1.3', 'Vermelho', 8),
(8, 'MLP-881', 'Toyota Corolla 2.0', 'Prata', 9),
(9, 'QIE-502', 'Jeep Renegade 1.8', 'Preto', 10),
(10, 'RLB-7C3', 'Honda HR-V 1.8', 'Branco', 11),
(11, 'MGA-291', 'Nissan Kicks 1.6', 'Cinza', 12),
(12, 'RDN-4F5', 'Renault Kwid 1.0', 'Vermelho', 13),
(13, 'QHB-612', 'Ford Ka 1.5', 'Azul', 14),
(14, 'MKK-774', 'Chevrolet Tracker 1.2', 'Prata', 15),
(15, 'RLC-1A8', 'Volkswagen T-Cross 1.0', 'Preto', 16),
(16, 'OKF-902', 'Fiat Cronos 1.3', 'Branco', 17),
(17, 'QHD-221', 'Toyota Yaris 1.5', 'Cinza', 18),
(18, 'MKL-349', 'Hyundai Creta 1.6', 'Vermelho', 19),
(19, 'RLE-8E1', 'Jeep Compass 2.0', 'Preto', 20),
(20, 'QHE-782', 'Honda Civic 2.0', 'Prata', 21),
(21, 'MKM-110', 'Nissan Versa 1.6', 'Branco', 22),
(22, 'RLF-3F4', 'Renault Sandero 1.6', 'Azul', 23),
(23, 'OKH-556', 'Ford EcoSport 1.5', 'Cinza', 24),
(24, 'QHF-891', 'Chevrolet Cruze 1.4', 'Preto', 25),
(25, 'MKN-443', 'Volkswagen Virtus 1.6', 'Branco', 26),
(26, 'RLG-6G7', 'Fiat Pulse 1.0', 'Vermelho', 27),
(27, 'OKJ-201', 'Toyota Corolla Cross', 'Prata', 28),
(28, 'QHG-338', 'Hyundai HB20S 1.0', 'Cinza', 29),
(29, 'MKO-992', 'Peugeot 208 1.6', 'Azul', 30),
(30, 'RLH-9H0', 'Citroen C4 Cactus', 'Preto', 31),
(31, 'OKK-114', 'Renault Duster 1.6', 'Branco', 32),
(32, 'QHH-775', 'Fiat Toro 1.3', 'Vermelho', 33),
(33, 'MKP-661', 'Volkswagen Nivus 1.0', 'Cinza', 34);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `bilhete`
--
ALTER TABLE `bilhete`
  ADD PRIMARY KEY (`id_bilhete`),
  ADD KEY `fk_Bilhete_Veiculo1_idx` (`Veiculo_id_veiculo`),
  ADD KEY `fk_Bilhete_Vaga1_idx` (`Vaga_id_vaga`);

--
-- Índices para tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `cpf_cliente_UNIQUE` (`cpf_cliente`);

--
-- Índices para tabela `vaga`
--
ALTER TABLE `vaga`
  ADD PRIMARY KEY (`id_vaga`);

--
-- Índices para tabela `veiculo`
--
ALTER TABLE `veiculo`
  ADD PRIMARY KEY (`id_veiculo`),
  ADD UNIQUE KEY `placa_veiculo_UNIQUE` (`placa_veiculo`),
  ADD KEY `fk_Veiculo_Cliente_idx` (`Cliente_id_cliente`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `bilhete`
--
ALTER TABLE `bilhete`
  MODIFY `id_bilhete` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de tabela `vaga`
--
ALTER TABLE `vaga`
  MODIFY `id_vaga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `veiculo`
--
ALTER TABLE `veiculo`
  MODIFY `id_veiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `bilhete`
--
ALTER TABLE `bilhete`
  ADD CONSTRAINT `fk_Bilhete_Vaga1` FOREIGN KEY (`Vaga_id_vaga`) REFERENCES `vaga` (`id_vaga`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Bilhete_Veiculo1` FOREIGN KEY (`Veiculo_id_veiculo`) REFERENCES `veiculo` (`id_veiculo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `veiculo`
--
ALTER TABLE `veiculo`
  ADD CONSTRAINT `fk_Veiculo_Cliente` FOREIGN KEY (`Cliente_id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
