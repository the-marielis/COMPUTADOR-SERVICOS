import React from 'react';
import Carousel from '../components/Carousel';
import './Home.css';
import produto1 from '../images/imagem1.png'; // Aponta para a pasta de imagens
import produto2 from '../images/imagem1.png'; 
import produto3 from '../images/imagem1.png'; 

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao nosso sistema de Peças e Serviços de Computadores</h1>
      
      <Carousel />
      
      <div className="description">
        <p>
          Nosso sistema é voltado para a venda e manutenção de equipamentos de informática, 
          oferecendo produtos de alta qualidade e serviços especializados para atender todas as suas necessidades tecnológicas.
        </p>
      </div>
      
      <div className="product-gallery">
        <div className="product-item">
          <img src={produto1} alt="Produto 1" />
          <p>Produto 1 - R$ 299,99</p>
        </div>
        <div className="product-item">
          <img src={produto2} alt="Produto 2" />
          <p>Produto 2 - R$ 499,99</p>
        </div>
        <div className="product-item">
          <img src={produto3} alt="Produto 3" />
          <p>Produto 3 - R$ 699,99</p>
        </div>
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 Peças e Serviços de Computadores. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
