// server.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./usuarios.db'); // arquivo local

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false
}));

// Cria tabela
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

// Rotas
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  db.run('INSERT INTO users (nome, email, password) VALUES (?, ?, ?)', [nome, email, hashedPassword], function(err) {
    if (err) return res.send('Erro: Email já registrado!');
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.send('Usuário não encontrado.');
    const match = await bcrypt.compare(senha, user.password);
    if (!match) return res.send('Senha incorreta.');
    req.session.userId = user.id;
    res.redirect('/dashboard');
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.send('<h1>Bem-vindo ao Kashimozin Design</h1><a href="/logout">Sair</a>');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

app.get('/perfil', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  db.get('SELECT nome, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) return res.send('Erro ao carregar perfil.');
    res.send(`
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> ${user.nome}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <a href="/dashboard">Voltar</a> | <a href="/logout">Sair</a>
    `);
  });
});

app.get('/perfil', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public/perfil.html'));
});

app.get('/api/perfil', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ erro: 'Não logado' });
  db.get('SELECT nome, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
    res.json(user);
  });
});
