<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $email = $_POST["email"];
  $senha = $_POST["senha"];

  $stmt = $conn->prepare("SELECT id, senha FROM usuarios WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $senha_hash);
    $stmt->fetch();

    if (password_verify($senha, $senha_hash)) {
      session_start();
      $_SESSION["usuario_id"] = $id;
      echo "Login realizado com sucesso!";
    } else {
      echo "Senha incorreta.";
    }
  } else {
    echo "Usuário não encontrado.";
  }

  $stmt->close();
}
?>
