import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import Logo from '../images/logo.png';

const Sidebar = ({ isCollapsed, onToggle }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <Link to="/" className="sidebar-link">
        <HomeIcon />
        {!isCollapsed && <span>Início</span>}
      </Link>

      <Link to="/sobre" className="sidebar-link">
        <InfoIcon />
        {!isCollapsed && <span>Sobre</span>}
      </Link>

      <div className="dropdown">
        <span className="dropdown-title">
          {isCollapsed ? null : 'Cadastros'}
        </span>
        <div className="dropdown-content">
          <Link to="/cadastros/cliente" className="sidebar-link">
            <PersonIcon />
            {!isCollapsed && <span>Cliente</span>}
          </Link>
          <Link to="/cadastros/produto" className="sidebar-link">
            <CategoryIcon />
            {!isCollapsed && <span>Produto</span>}
          </Link>
          <Link to="/cadastros/pedido" className="sidebar-link">
            <ShoppingCartIcon />
            {!isCollapsed && <span>Pedido</span>}
          </Link>

        </div>

      </div>

      <button className="toggle-button" onClick={onToggle}>
        {isCollapsed ? '→' : '←'}
      </button>
      <div className="sidebar-logo">
        <img src={Logo} alt="Logo" className="logo" />
        {!isCollapsed && <h1 className="logo-text">+1 Brusinha</h1>}
      </div>

    </div>
  );
};

export default Sidebar;
