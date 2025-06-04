const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/cadastrar', async (req, res) => {
  const { nome, email, senha } = req.body;
  // Aqui você salvaria no seu banco (ou localStorage) a lógica de cadastro real.
  // Depois, envia o e-mail de confirmação:

  // Crie um transporter SMTP (ex.: Gmail – é preciso ativar “app menos seguro” ou usar OAuth2)
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'SEU_EMAIL@gmail.com',
      pass: 'SUA_SENHA_APP', // ou app password
    }
  });

  const mailOptions = {
    from: '"Kashimozin Design" <SEU_EMAIL@gmail.com>',
    to: email,
    subject: 'Confirmação de Cadastro',
    text: `Olá ${nome},\n\nSeu cadastro foi realizado com sucesso!\n\nBem-vindo(a) ao Kashimozin Design!`,
    // ou use html: '<p>Olá <strong>' + nome + '</strong>, seu cadastro foi ...</p>'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ sucesso: true, msg: 'Cadastro realizado e e-mail enviado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, msg: 'Erro ao enviar e-mail.' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
