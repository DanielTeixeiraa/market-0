import React from "react";
import { Link } from "react-router-dom";

import "./style.css";
import Logo from "./icon.svg";

const Modal = () => {
  return (
    <div id="modal">
      <img src={Logo} alt="Logo" />
      <strong id='a'>Cadastro Concluído</strong>
      <Link to="/">
        <strong id='b'>Volte para o inicio</strong>
      </Link>
    </div>
  );
};

export default Modal;
