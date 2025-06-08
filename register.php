<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nome = $_POST["nome"];
  $email = $_POST["email"];
  $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT);

  $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
  $stmt->bind_param("sss", $nome, $email, $senha);

  if ($stmt->execute()) {
    echo "Cadastro realizado com sucesso!";
  } else {
    echo "Erro: " . $stmt->error;
  }

  $stmt->close();
}
?>
