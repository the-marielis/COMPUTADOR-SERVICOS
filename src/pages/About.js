import React from 'react';
import Sobre from '../images/about.jpg';
import './Home.css'

const About = () => {
  return (
    <div className='Sobre' style={{ padding: '20px' }}>
      <h1>Sobre Nós</h1>
      <p className='line'>________________________________________________</p>
      <p>
      Ser casual nunca foi tão autêntico. Aqui na +1 Brusinha, acreditamos que a moda deve ser simples: você usa o que te faz sentir bem. Nossa marca é sobre liberdade, conforto e estilo, com peças que abraçam o dia a dia sem deixar de lado a sua essência. Seja para trabalhar, curtir ou só relaxar, temos a peça certa pra te acompanhar.
      </p>
      <p>
      Vem com a gente transformar o básico no extraordinário, porque ser você mesma é sempre tendência.
      </p>
      <div className='Sobre'>
        <img src={Sobre} alt="about" className="about" />
      </div> 


    </div>
  );
};

export default About;
