import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 5) {
      alert('O nome de usuário deve ter no mínimo 5 caracteres.');
      return;
    }

    if (!validatePassword(password)) {
      alert(
        'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password
      });

      if (response.status === 200) {
        login();
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Usuário ou senha incorretos');
      } else {
        alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Entrar</button>
      </form>
      <div className="signup-link">
        <Link to="/cadastros/usuario">Cadastrar novo usuário</Link>
      </div>
    </div>
  );
};

export default Login;
