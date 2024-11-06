const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'banco_api_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

// Função para hash de senha
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Endpoint para cadastro de usuário
app.post('/api/usuarios', async (req, res) => {
  const { login, senha, nome, email, dataNascimento } = req.body;
  
  try {
    const hashedPassword = await hashPassword(senha);
    const query = 'INSERT INTO usuario (login, senha, nome, email, dataNascimento) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [login, hashedPassword, nome, email, dataNascimento], (err, result) => {
      if (err) throw err;
      res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao cadastrar o usuário.' });
  }
});

// Endpoint para login de usuário
app.post('/api/usuarios/login', (req, res) => {
  const { login, senha } = req.body;
  const query = 'SELECT * FROM usuario WHERE login = ?';

  db.query(query, [login], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(401).send({ message: 'Usuário não encontrado.' });
    }
    
    const user = results[0];
    const passwordMatch = await bcrypt.compare(senha, user.senha);

    if (passwordMatch) {
      res.send({ message: 'Login realizado com sucesso!', user: { id: user.id, nome: user.nome, email: user.email } });
    } else {
      res.status(401).send({ message: 'Senha incorreta.' });
    }
  });
});
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuario WHERE login = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).send({ error: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(401).send({ error: 'Usuário não encontrado' });
    }

    const user = results[0];

    // Comparando senha usando bcrypt se estiver usando hash
    bcrypt.compare(password, user.senha, (err, isMatch) => {
      if (err) return res.status(500).send({ error: 'Erro ao verificar a senha' });

      if (!isMatch) {
        return res.status(401).send({ error: 'Senha incorreta' });
      }

      res.status(200).send({ message: 'Login bem-sucedido', user });
    });
  });
});
// Endpoints para Clientes
app.post('/api/clientes', (req, res) => {
  const { nome, email, telefone, dataNascimento } = req.body;
  const query = 'INSERT INTO clientes (nome, email, telefone, dataNascimento) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, email, telefone, dataNascimento], (err, result) => {
    if (err) throw err;
    res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
  });
});

app.get('/api/clientes', (req, res) => {
  const query = 'SELECT * FROM clientes';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Endpoints para Produtos
app.post('/api/produtos', (req, res) => {
  const { codigo, nome, preco, marca, fornecedor } = req.body;
  const query = 'INSERT INTO produtos (codigo, nome, preco, marca, fornecedor) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [codigo, nome, preco, marca, fornecedor], (err, result) => {
    if (err) throw err;
    res.status(201).send({ message: 'Produto cadastrado com sucesso!' });
  });
});

app.get('/api/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Endpoints para Pedidos
app.post('/api/pedidos', (req, res) => {
  const { numero, dataPedido, valorTotal, clienteId, itens } = req.body;
  const queryPedido = 'INSERT INTO pedidos (numero, dataPedido, valorTotal, clienteId) VALUES (?, ?, ?, ?)';

  db.beginTransaction((err) => {
    if (err) throw err;

    db.query(queryPedido, [numero, dataPedido, valorTotal, clienteId], (err, result) => {
      if (err) return db.rollback(() => { throw err; });

      const pedidoId = result.insertId;
      const queryItem = 'INSERT INTO itensPedido (pedidoId, produtoId, quantidade, valorItem) VALUES ?';
      const itensValues = itens.map((item) => [pedidoId, item.produtoId, item.quantidade, item.valorItem]);

      db.query(queryItem, [itensValues], (err) => {
        if (err) return db.rollback(() => { throw err; });
        db.commit((err) => {
          if (err) return db.rollback(() => { throw err; });
          res.status(201).send({ message: 'Pedido cadastrado com sucesso!' });
        });
      });
    });
  });
});

app.get('/api/pedidos', (req, res) => {
  const query = `
    SELECT pedidos.id, pedidos.numero, pedidos.dataPedido, pedidos.valorTotal, clientes.nome as cliente
    FROM pedidos
    JOIN clientes ON pedidos.clienteId = clientes.id
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});