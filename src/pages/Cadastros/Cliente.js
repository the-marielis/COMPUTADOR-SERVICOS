import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({ nome: '', email: '', telefone: '', dataNascimento: '' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);

  const clientesPorPagina = 10;

  const carregarClientes = useCallback(async () => {
    try {
      const resposta = await axios.get(`http://localhost:3001/api/clientes`, {
        params: { page: paginaAtual, limit: clientesPorPagina, search: busca },
      });
      setClientes(resposta.data.clientes || []);
      setTotalPaginas(resposta.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }, [paginaAtual, busca]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setBusca(e.target.value);
    setPaginaAtual(1);  // Reseta para a primeira página sempre que a busca mudar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/clientes/${editando}`, cliente);
        alert('Cliente atualizado com sucesso!');
        setEditando(null);
      } else {
        await axios.post('http://localhost:3001/api/clientes', cliente);
        alert('Cliente cadastrado com sucesso!');
      }
      setCliente({ nome: '', email: '', telefone: '', dataNascimento: '' });
      carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEdit = (cliente) => {
    const dataFormatada = cliente.dataNascimento.split('T')[0];
    setCliente({ ...cliente, dataNascimento: dataFormatada });
    setEditando(cliente.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`http://localhost:3001/api/clientes/${id}`);
        alert('Cliente excluído com sucesso!');
        carregarClientes();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handlePageChange = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  return (
    <div className="form-container">
      <h2>{editando ? 'Editar Cliente' : 'Cadastro de Cliente'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={cliente.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={cliente.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input type="text" name="telefone" value={cliente.telefone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input type="date" name="dataNascimento" value={cliente.dataNascimento} onChange={handleChange} required />
        </div>
        <button type="submit" className="button">
          {editando ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
      </form>
      <br />
      {/* Campo de busca */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <TextField
          label="Pesquisar cliente"
          type="text"
          value={busca}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>

      {/* Lista de clientes com paginação */}
      <h3>Clientes Cadastrados</h3>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes && clientes.length > 0 ? (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.dataNascimento.split('T')[0]}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(cliente)}
                      startIcon={<EditIcon />}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(cliente.id)}
                      startIcon={<DeleteIcon />}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Controles de paginação */}
      <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          onClick={() => handlePageChange(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          variant="outlined"
          color="primary"
        >
          Anterior
        </Button>
        <span style={{ margin: '0 10px' }}>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <Button
          onClick={() => handlePageChange(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          variant="outlined"
          color="primary"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default Cliente;
