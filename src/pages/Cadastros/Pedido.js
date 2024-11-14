import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Pedido = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientesTotalPages, setClientesTotalPages] = useState(1);
  const [produtosTotalPages, setProdutosTotalPages] = useState(1);
  const [clientesPage, setClientesPage] = useState(1);
  const [produtosPage, setProdutosPage] = useState(1);
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [totalPaginas, setTotalPaginas] = useState(1); // Total de páginas

  const [pedido, setPedido] = useState({
    id: "",
    numero: "",
    dataPedido: "",
    clienteId: "",
    valorTotal: "",
    itens: [],
  });

  const [pedidoCliente, setPedidoCliente] = useState(null);

  const [novoItem, setNovoItem] = useState({ produtoId: "", quantidade: 1 });
  const [valorTotal, setValorTotal] = useState(0);

  const [pedidos, setPedidos] = useState([]);
  const [searchNumero, setSearchNumero] = useState("");
  const [pedidosPage, setPedidosPage] = useState(1);
  const [pedidosTotalPages, setPedidosTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const fetchClientes = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/clientes?page=${page}&limit=${limit}`
      );
      setClientes(
        Array.isArray(response.data.clientes) ? response.data.clientes : []
      );
      setClientesTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/produtos?page=${page}&limit=${limit}`
      );
      setProdutos(
        Array.isArray(response.data.produtos) ? response.data.produtos : []
      );
      setProdutosTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async (page = 1, limit = 10, numero = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/pedidos?page=${page}&limit=${limit}&numero=${numero}`
      );
      if (Array.isArray(response.data.pedidos)) {
        setPedidos(response.data.pedidos); // Atualiza os pedidos
        setPedidosTotalPages(response.data.totalPages || 1); // Atualiza o total de páginas
        setPaginaAtual(page); // Atualiza a página atual
        setTotalPaginas(response.data.totalPages); // Atualiza o total de páginas
      } else {
        console.error("Dados de pedidos inválidos", response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fecthItensPedido = async (pedidoId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/pedidos/${pedidoId}/itens`
      );
      return response.data.itensPedido;
    } catch (error) {
      console.error("Erro ao carregar itens do pedido");
    }
  };

  useEffect(() => {
    fetchClientes(clientesPage);
    fetchProdutos(produtosPage);
  }, [clientesPage, produtosPage]);

  useEffect(() => {
    fetchPedidos(pedidosPage, 10, searchNumero);
  }, [pedidosPage, searchNumero]);

  useEffect(() => {
    if (!pedido.itens) return;
    const total = pedido.itens.reduce((sum, item) => sum + item.valorItem, 0);
    setValorTotal(total);
  }, [pedido.itens]);

  const resetForm = () => {
    setPedido({
      id: "",
      numero: "",
      dataPedido: "",
      clienteId: "",
      valorTotal: "",
      itens: [],
    });
    setPedidoCliente({});
  };
  const adicionarItem = () => {
    if (!novoItem.produtoId) {
      alert("Por favor, selecione um produto antes de adicionar o item.");
      return;
    }
    if (novoItem.quantidade <= 0) {
      alert("A quantidade do produto deve ser maior que 0.");
      return;
    }
    const produto = produtos.find((p) => p.id === parseInt(novoItem.produtoId));
    if (produto) {
      const valorItem = produto.preco * novoItem.quantidade;
      const item = {
        produtoId: parseInt(novoItem.produtoId),
        quantidade: novoItem.quantidade,
        valorItem,
      };

      setPedido((prevPedido) => ({
        ...prevPedido,
        itens: [...prevPedido.itens, item],
      }));
      setNovoItem({ produtoId: "", quantidade: 1 });
    }
  };

  const removerItem = (index) => {
    setPedido((prevPedido) => {
      const itensAtualizados = [...prevPedido.itens];
      itensAtualizados.splice(index, 1);
      return { ...prevPedido, itens: itensAtualizados };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedido.clienteId) {
      alert("Por favor, selecione um cliente antes de cadastrar o pedido.");
      return;
    }
    if (pedido.itens.length === 0) {
      alert("É necessário adicionar pelo menos um item ao pedido.");
      return;
    }

    try {
      // Se pedido possui ID, atualiza pedido
      if (pedido.id) {
        await axios.put(`http://localhost:3001/api/pedidos/${pedido.id}`, {
          ...pedido,
          valorTotal,
        });
        alert("Pedido atualizado com sucesso!");

      // Senão, salva novo pedido
      } else {
        await axios.post("http://localhost:3001/api/pedidos", {
          ...pedido,
          valorTotal,
        });
        alert("Pedido cadastrado com sucesso!");
      }

      fetchPedidos(1, 10, searchNumero);
      setPedido({
        id: null,
        numero: "",
        dataPedido: "",
        clienteId: "",
        itens: [],
      });
      setPedidoCliente({});
      setValorTotal(0);
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
    }
  };

  const editarPedido = async (pedido) => {
    // Converte a data para o formato "yyyy-MM-dd" caso esteja no formato ISO
    const dataFormatada = pedido.dataPedido
      ? new Date(pedido.dataPedido).toISOString().split("T")[0]
      : "";

    // Pelo ID do cliente, encontra o objeto para popular campo autocomplete
    setPedidoCliente(
      clientes.find((cliente) => cliente.id === pedido.clienteId)
    );

    // Recupera os itens do pedido
    const itens = await fecthItensPedido(pedido.id);

    setPedido({
      ...pedido,
      dataPedido: dataFormatada,
      itens,
    });
  };

  const excluirPedido = async (pedidoId) => {
    try {
      await axios.delete(`http://localhost:3001/api/pedidos/${pedidoId}`);
      alert("Pedido excluído com sucesso!");
      fetchPedidos(paginaAtual); // Atualiza a lista de pedidos após exclusão
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
    }
  };

  const handlePageChange = (novaPagina) => {
    setPaginaAtual(novaPagina);
    fetchPedidos(novaPagina, 10, searchNumero); // Atualiza a página de pedidos
  };

  return (
    <div className="form-container">
      {loading && <CircularProgress />}
      {!loading && (
        <div>
          <h2>Cadastro de Pedido</h2>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={resetForm}>Novo Pedido</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Número do Pedido:</label>
              <input
                type="text"
                name="numero"
                value={pedido.numero}
                onChange={(e) =>
                  setPedido({ ...pedido, numero: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Data do Pedido:</label>
              <input
                type="date"
                name="dataPedido"
                value={pedido.dataPedido}
                onChange={(e) =>
                  setPedido({ ...pedido, dataPedido: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clienteId">Cliente:</label>
              <Autocomplete
                value={pedidoCliente}
                options={clientes}
                getOptionLabel={(pedidoCliente) => pedidoCliente.nome || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecione um cliente"
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) => {
                  setPedido({
                    ...pedido,
                    clienteId: newValue ? newValue.id : "",
                  });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.clienteId === value.id
                }
              />
            </div>

            <h3>Itens do Pedido</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Valor Item</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens?.length > 0 &&
                    pedido.itens.map((item, index) => {
                      const produto = produtos.find(
                        (p) => p.id === item.produtoId
                      );
                      return (
                        <tr key={index}>
                          <td>
                            {produto ? produto.nome : "Produto desconhecido"}
                          </td>
                          <td>{item.quantidade}</td>
                          <td>R$ {item.valorItem.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removerItem(index)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td>
                      <Autocomplete
                        options={produtos}
                        getOptionLabel={(produto) =>
                          produto.nome + " - R$" + produto.preco
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecione um produto"
                            variant="outlined"
                          />
                        )}
                        onChange={(event, newValue) =>
                          setNovoItem({
                            ...novoItem,
                            produtoId: newValue ? newValue.id : "",
                          })
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={novoItem.quantidade}
                        onChange={(e) =>
                          setNovoItem({
                            ...novoItem,
                            quantidade: parseInt(e.target.value) || 1,
                          })
                        }
                        min="1"
                      />
                    </td>
                    <td>
                      {novoItem.produtoId && novoItem.quantidade
                        ? `R$ ${(
                            produtos.find((p) => p.id === novoItem.produtoId)
                              ?.preco * novoItem.quantidade || 0
                          ).toFixed(2)}`
                        : "R$ 0.00"}
                    </td>
                    <td>
                      <button type="button" onClick={adicionarItem}>
                        Adicionar Item
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-group">
              <label>Valor Total:</label>
              <input
                type="text"
                value={`R$ ${valorTotal.toFixed(2)}`}
                disabled
              />
            </div>

            <button type="submit" className="button">
              Cadastrar Pedido
            </button>
          </form>

          <div className="pedidos-list">
            <h3>Pedidos Cadastrados</h3>
            <input
              type="text"
              placeholder="Buscar pelo número do pedido"
              value={searchNumero}
              onChange={(e) => setSearchNumero(e.target.value)}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Valor Total</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidos && pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell>{pedido.numero}</TableCell>
                        <TableCell>{pedido.nomeCliente}</TableCell>
                        <TableCell>{pedido.dataPedido.split("T")[0]}</TableCell>
                        <TableCell>
                          R$ {(Number(pedido.valorTotal) || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => editarPedido(pedido)}
                            startIcon={<EditIcon />}
                          ></Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => excluirPedido(pedido.id)}
                            startIcon={<DeleteIcon />}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum pedido encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div
              className="pagination"
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              <Button
                onClick={() => handlePageChange(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                variant="outlined"
                color="primary"
              >
                Anterior
              </Button>
              <span style={{ margin: "0 10px" }}>
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
        </div>
      )}
    </div>
  );
};

export default Pedido;
