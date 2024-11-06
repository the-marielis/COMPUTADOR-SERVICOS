import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedido = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedido, setPedido] = useState({
    numero: '',
    dataPedido: '',
    clienteId: '',
    itens: [],
  });
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('/api/clientes');
        setClientes(clientesResponse.data);

        const produtosResponse = await axios.get('/api/produtos');
        setProdutos(produtosResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = (produtoId, quantidade) => {
    const produto = produtos.find((p) => p.id === parseInt(produtoId));
    const valorItem = produto.preco * quantidade;

    setPedido((prevPedido) => ({
      ...prevPedido,
      itens: [...prevPedido.itens, { produtoId, quantidade, valorItem }],
    }));

    setValorTotal((prevTotal) => prevTotal + valorItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pedidos', { ...pedido, valorTotal });
      alert('Pedido cadastrado com sucesso!');
      setPedido({
        numero: '',
        dataPedido: '',
        clienteId: '',
        itens: [],
      });
      setValorTotal(0);
    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Pedido</h2>
      <form onSubmit={handleSubmit}>
        <label>Número do Pedido:</label>
        <input type="text" name="numero" value={pedido.numero} onChange={(e) => setPedido({ ...pedido, numero: e.target.value })} required />

        <label>Data do Pedido:</label>
        <input type="date" name="dataPedido" value={pedido.dataPedido} onChange={(e) => setPedido({ ...pedido, dataPedido: e.target.value })} required />

        <label>Cliente:</label>
        <select name="clienteId" value={pedido.clienteId} onChange={(e) => setPedido({ ...pedido, clienteId: e.target.value })} required>
          <option value="">Selecione o cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
          ))}
        </select>

        <h3>Itens do Pedido</h3>
        <div>
          {produtos.length > 0 && produtos.map((produto) => (
            <div key={produto.id}>
              <label>{produto.nome} - Preço: R$ {produto.preco}</label>
              <input type="number" placeholder="Quantidade" min="1" onChange={(e) => handleAddItem(produto.id, parseInt(e.target.value))} />
            </div>
          ))}
        </div>

        <h3>Valor Total do Pedido: R$ {valorTotal.toFixed(2)}</h3>

        <button type="submit">Cadastrar Pedido</button>
      </form>
    </div>
  );
};

export default Pedido;
