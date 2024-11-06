SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
DROP DATABASE IF EXISTS `banco_api_db`;
CREATE DATABASE IF NOT EXISTS `banco_api_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `banco_api_db`;


CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `dataNascimento` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


INSERT INTO `clientes` (`id`, `nome`, `email`, `telefone`, `dataNascimento`) VALUES
(1, 'Ronye Peterson', 'ronye.cordeiro@escola.pr.gov.br', '45 99999-999999', '2024-11-04');


CREATE TABLE IF NOT EXISTS `itenspedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedidoId` int(11) DEFAULT NULL,
  `produtoId` int(11) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `valorItem` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidoId` (`pedidoId`),
  KEY `produtoId` (`produtoId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(20) DEFAULT NULL,
  `dataPedido` date DEFAULT NULL,
  `valorTotal` decimal(10,2) DEFAULT NULL,
  `clienteId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clienteId` (`clienteId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `fornecedor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dataNascimento` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
