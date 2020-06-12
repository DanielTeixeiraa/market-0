import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";

import Dropzone from "../../components/dropzone";
import Modal from "../modal/modal";
import api from "../../services/api";

import "./style.css";

import logo from "../../assets/logo.svg";

//aray ou objeto: manualmente informar o tipo do objeto

interface Item {
  id: number;
  title: string;
  image_url: string;
}
interface IBGE {
  sigla: string;
}
interface IBGECity {
  nome: string;
}

const CreateMarket = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: " ",
    email: " ",
    descricao: " ",
  });

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedUF, setSelectedUF] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedItens, setSelectedItens] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("items").then((res) => {
      setItems(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGE[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufSigla = res.data.map((uf) => uf.sigla);
        setUfs(ufSigla);
      });
  });
  //carregar as cidades toda vez que o usuario selecionar o UF
  useEffect(() => {
    if (selectedUF === "0") {
      return;
    }
    axios
      .get<IBGECity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((res) => {
        const cityName = res.data.map((city) => city.nome);
        setCities(cityName);
      });
    console.log("mudou", selectedUF);
  }, [selectedUF]);

  function selectuf(event: ChangeEvent<HTMLSelectElement>) {
    const uF = event.target.value;
    setSelectedUF(uF);
  }

  function selectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function mapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function inputChage(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function textAreaChage(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function clickItem(id: number) {
    const alreadySelected = selectedItens.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItens.filter((item) => item != id);
      setSelectedItens(filteredItems);
    } else {
      setSelectedItens([...selectedItens, id]);
    }
  }

  function handSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, descricao } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longtude] = selectedPosition;
    const items = selectedItens;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("descricao", descricao);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longtude", String(longtude));
    data.append("items", items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    api.post("markets", data);
    setModalVisibility(true);
  }

  return (
    <>
      <div id="page-create-market">
        <header>
          <div>
            <img src={logo} alt="Logo" />
            <span>
              Market<span style={{ color: "#2f2e41" }}>Ø</span>
            </span>
          </div>
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>
        <form onSubmit={handSubmit}>
          <h1>
            Cadastro do <br /> mercado
          </h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>
            <div className="field">
              <label htmlFor="name">Nome do mercado</label>
              <input type="text" name="name" id="name" onChange={inputChage} />
            </div>
            <div className="field">
              <label htmlFor="name">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={inputChage}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Pequena descrição</label>
              <textarea
                name="descricao"
                id="descricao"
                onChange={textAreaChage}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione endereço no mapa</span>
            </legend>
            <Map onclick={mapClick} center={initialPosition} zoom={13}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />
            </Map>
            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  value={selectedUF}
                  onChange={selectuf}
                >
                  <option value="0">Selecione um UF</option>
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  onChange={selectCity}
                  value={selectedCity}
                >
                  <option value="0">Selecione uma Cidade</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h3>Qual tipo de produto seu mercado possui</h3>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => clickItem(item.id)}
                  className={selectedItens.includes(item.id) ? "selected" : ""}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar mercado</button>
        </form>
      </div>
      {modalVisibility === true ? <Modal /> : null}
    </>
  );
};

export default CreateMarket;
