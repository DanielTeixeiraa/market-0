import React from "react";
import { Link } from 'react-router-dom';
import "./style.css";

import logo from "../../assets/logo.svg";


const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Logo" />
          <span>Market<span style={{ color: "#2f2e41" }}>Ø</span></span>
        </header>
        <main>
          <h1>O mercado <b>ideal</b> na palma da sua mão</h1>
          <p>O que voce procura pode está ao lado de você</p>
          <Link to="/create-market">
            <span>
            </span>
            <strong>Cadastre um mercado</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};
export default Home;
