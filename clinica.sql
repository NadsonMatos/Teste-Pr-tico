CREATE DATABASE clinica;

USE clinica;

CREATE TABLE Pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    dataNasc DATE NOT NULL,
    peso FLOAT,
    altura FLOAT,
    uf VARCHAR(2) NOT NULL
);