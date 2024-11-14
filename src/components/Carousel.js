import React, { useState, useEffect } from 'react';
import './Carousel.css';
import imagem1 from '../images/carousel1.png';
import imagem2 from '../images/carousel2.png'; 
import imagem3 from '../images/carousel3.png'; 

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [imagem1, imagem2, imagem3];

  // Avançar automaticamente para a próxima imagem a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [items.length]);

  return (
    <div className="carousel">
      <div className="carousel-item">
        <img src={items[currentIndex]} alt={`Imagem ${currentIndex + 1}`} />
      </div>
      <div className="carousel-controls">
        {items.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
