import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Produto = () => {
  const [produtos, setProdutos] = useState([]);
  const [produto, setProduto] = useState({ codigo: '', nome: '', preco: '', marca: '', fornecedor: '' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);

  const produtosPorPagina = 10;

  const carregarProdutos = useCallback(async () => {
    try {
      const resposta = await axios.get(`http://localhost:3001/api/produtos`, {
        params: { page: paginaAtual, limit: produtosPorPagina, search: busca },
      });
     
      setProdutos(resposta.data.produtos || []);
      setTotalPaginas(resposta.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }, [paginaAtual, busca]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setBusca(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/produtos/${editando}`, produto);
        alert('Produto atualizado com sucesso!');
        setEditando(null);
      } else {
        await axios.post('http://localhost:3001/api/produtos', produto);
        alert('Produto cadastrado com sucesso!');
      }
      setProduto({ codigo: '', nome: '', preco: '', marca: '', fornecedor: '' });
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto) => {
    setProduto(produto);
    setEditando(produto.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:3001/api/produtos/${id}`);
        alert('Produto excluído com sucesso!');
        carregarProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handlePageChange = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  return (
    <div className="form-container">
      <h2>{editando ? 'Editar Produto' : 'Cadastro de Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código:</label>
          <input type="text" name="codigo" value={produto.codigo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={produto.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Preço:</label>
          <input type="number" name="preco" value={produto.preco} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input type="text" name="marca" value={produto.marca} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fornecedor:</label>
          <input type="text" name="fornecedor" value={produto.fornecedor} onChange={handleChange} required />
        </div>
        <button type="submit" className="button">
          {editando ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>
      </form>
      <br />
      {/* Campo de busca */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <TextField
          label="Pesquisar produto"
          type="text"
          value={busca}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>

      <h3>Produtos Cadastrados</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos && produtos.length > 0 ? (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.preco}</TableCell>
                  <TableCell>{produto.marca}</TableCell>
                  <TableCell>{produto.fornecedor}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(produto)}
                      startIcon={<EditIcon />}
                    ></Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(produto.id)}
                      startIcon={<DeleteIcon />}
                    ></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default Produto;
