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
  database: 'banco_api_db',
  decimalNumbers: true
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


// Função para carregar clientes com paginação e busca
app.get('/api/clientes', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const offset = (page - 1) * limit;

  // Construindo a consulta SQL com paginação e busca
  const sqlCount = `SELECT COUNT(*) AS total FROM clientes WHERE nome LIKE ?`;
  const sqlSelect = `SELECT * FROM clientes WHERE nome LIKE ? LIMIT ? OFFSET ?`;

  db.query(sqlCount, [`%${search}%`], (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao contar clientes.');
    }

    const totalClientes = countResult[0].total;
    const totalPages = Math.ceil(totalClientes / limit);
 
    db.query(sqlSelect, [`%${search}%`, limit, offset], (err, clientes) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao carregar clientes.');
      }

      res.json({
        clientes: clientes,
        totalPages: totalPages,
      });
    });
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

// Função para carregar produtos com paginação e busca
app.get('/api/produtos', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const offset = (page - 1) * limit;

  // Construindo a consulta SQL com paginação e busca
  const sqlCount = `SELECT COUNT(*) AS total FROM produtos WHERE nome LIKE ?`;
  const sqlSelect = `SELECT * FROM produtos WHERE nome LIKE ? LIMIT ? OFFSET ?`;

  db.query(sqlCount, [`%${search}%`], (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao contar produtos.');
    }

    const totalProdutos = countResult[0].total;
    const totalPages = Math.ceil(totalProdutos / limit);
 
    db.query(sqlSelect, [`%${search}%`, limit, offset], (err, produtos) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao carregar produtos.');
      }

      res.json({
        produtos: produtos,
        totalPages: totalPages,
      });
    });
  });
});

// Endpoints para Pedidos

// Insere pedido
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

// Atualiza pedido
app.put('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;
  const { numero, dataPedido, valorTotal, clienteId, itens } = req.body;
  
  const queryUpdatePedido = 'UPDATE pedidos SET numero = ?, dataPedido = ?, valorTotal = ?, clienteId = ? WHERE id = ?';
  
  db.beginTransaction((err) => {
    if (err) throw err;

    // Atualiza o pedido principal
    db.query(queryUpdatePedido, [numero, dataPedido, valorTotal, clienteId, pedidoId], (err, result) => {
      if (err) return db.rollback(() => { throw err; });
      
      // Remove os itens antigos associados ao pedido
      const queryDeleteItens = 'DELETE FROM itensPedido WHERE pedidoId = ?';
      db.query(queryDeleteItens, [pedidoId], (err) => {
        if (err) return db.rollback(() => { throw err; });
        
        // Insere os novos itens do pedido
        const queryInsertItens = 'INSERT INTO itensPedido (pedidoId, produtoId, quantidade, valorItem) VALUES ?';
        const itensValues = itens.map((item) => [pedidoId, item.produtoId, item.quantidade, item.valorItem]);
        
        db.query(queryInsertItens, [itensValues], (err) => {
          if (err) return db.rollback(() => { throw err; });
          
          db.commit((err) => {
            if (err) return db.rollback(() => { throw err; });
            res.status(200).send({ message: 'Pedido atualizado com sucesso!' });
          });
        });
      });
    });
  });
});


// Retorna todos os pedidos
app.get('/api/pedidos', (req, res) => {
  const { page = 1, limit = 10, numero = '' } = req.query;

  // Calcular o offset para a página
  const offset = (page - 1) * limit;

  // Construir a consulta SQL com o filtro para o número do pedido, se fornecido
  let query = `
    SELECT pedidos.id, pedidos.numero, pedidos.dataPedido, pedidos.valorTotal, pedidos.clienteId, clientes.nome as nomeCliente
    FROM pedidos
    JOIN clientes ON pedidos.clienteId = clientes.id
    ORDER BY pedidos.dataPedido DESC
  `;
  let queryParams = [];

  if (numero) {
    query += ' WHERE pedidos.numero LIKE ?';
    queryParams.push(`%${numero}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), offset);

  // Consultar os pedidos
  db.query(query, queryParams, (err, results) => {
    if (err) throw err;

    // Contar o número total de pedidos para calcular o total de páginas
    const countQuery = `
      SELECT COUNT(*) as total FROM pedidos
      JOIN clientes ON pedidos.clienteId = clientes.id
      ${numero ? 'WHERE pedidos.numero LIKE ?' : ''}
    `;
    db.query(countQuery, numero ? [`%${numero}%`] : [], (err, countResults) => {
      if (err) throw err;
      
      const totalCount = countResults[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.send({
        pedidos: results,
        totalPages,
      });
    });
  });
});

app.delete('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;

  // SQL para deletar o pedido
  const query = 'DELETE FROM pedidos WHERE id = ?';

  // Executa a query de exclusão
  db.query(query, [pedidoId], (err, result) => {
    if (err) {
      console.error("Erro ao excluir o pedido:", err);
      return res.status(500).send({ message: "Erro ao excluir o pedido." });
    }

    if (result.affectedRows === 0) {
      // Caso nenhum pedido tenha sido encontrado
      return res.status(404).send({ message: "Pedido não encontrado." });
    }

    // Retorna sucesso com uma mensagem
    res.status(200).send({ message: "Pedido excluído com sucesso!" });
  });
});

app.get('/api/pedidos/:id/itens', (req, res) => {
  const pedidoId = req.params.id;
  // Query para obter os itens de pedido com informações dos produtos
  const query = `
    SELECT i.id, i.pedidoId, i.produtoId, i.quantidade, i.valorItem, p.nome
    FROM itenspedido i
    JOIN produtos p ON p.id = i.produtoId
    WHERE i.pedidoId = ${pedidoId}
  `;

  // Executar a consulta
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao consultar itens de pedidos:", err);
      res.status(500).send("Erro ao consultar itens de pedidos.");
      return;
    }

    // Retornar os resultados diretamente
    res.send({
      itensPedido: results,
    });
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});