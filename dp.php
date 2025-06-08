<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "kashimozin";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Erro de conexão: " . $conn->connect_error);
}
?>

CREATE DATABASE IF NOT EXISTS kashimozin;
USE kashimozin;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);
