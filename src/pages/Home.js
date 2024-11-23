import React from 'react';
import Carousel from '../components/Carousel';
import './Home.css';
import produto1 from '../images/imagem1.png'; // Aponta para a pasta de imagens
import produto2 from '../images/imagem2.png'; 
import produto3 from '../images/imagem3.png'; 

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao +1 brusinha</h1>
      
      <Carousel />
      
      <div className="description">
        <p>
        Mais do que roupas, são expressões do seu jeito de ser. Seja +1 inspiração com nossa coleção exclusiva!
        </p>
      </div>
      
      <div className="product-gallery">
        <div className="product-item">
          <img src={produto1} alt="Produto 1" />
          <p>Confira nossa coleção inverno</p>
        </div>
        <div className="product-item">
          <img src={produto2} alt="Produto 2" />
          <p>Coleção Feminina</p>
        </div>
        <div className="product-item">
          <img src={produto3} alt="Produto 3" />
          <p>Coleção Masculina</p>
        </div>
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 Mais uma Brusinha. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
