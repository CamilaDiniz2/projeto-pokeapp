import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import Pokemon from '../components/pokemon/Pokemon';
import Pagination from '@material-ui/lab/Pagination';
import LoadingScreen from '../components/Loading/Loading';
import Footer from '../components/footer/Footer';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import CardDeck from 'react-bootstrap/Card';

export default function Home() {
  const APP_URL = 'https://pokeapi.co/api/v2/pokemon';
  const LIMIT_ITENS_PER_PAGE = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, value) => {
    let rangeSelected = value - 1 <= 0 ? 0 : value - 1;
    let offset = rangeSelected * LIMIT_ITENS_PER_PAGE;
    let url_link = APP_URL + `?offset=${offset}&limit=${LIMIT_ITENS_PER_PAGE}`;
    console.log(url_link);

    getPokemonsList(url_link);
  };

  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);

  useEffect(() => {
    getPokemonsList('');
    setTimeout(() => setLoading(false), 1);
  }, []);

  const getPokemonsList = async (url) => {
    let urlSelected = url && url.length > 0 ? url : APP_URL;
    const response = await fetch(urlSelected);
    const data = await response.json();

    let numberOfPages = Math.ceil(data.count / LIMIT_ITENS_PER_PAGE);
    setTotalPages(numberOfPages);

    getAllPokemonsList(data.count);

    setPokemons(data.results);
  };

  const getAllPokemonsList = async (max) => {
    console.log(max);
    let limite = max ? max : 5000;
    let urlLinkAllPokemons = APP_URL + `?limit=${limite}`;

    const response = await fetch(urlLinkAllPokemons);
    const data = await response.json();

    setAllPokemons(data.results);
  };

  // funcao de filtro dos Pokemons
  const [pesquisar, setPesquisar] = useState('');
  const handleChange = (event) => {
    setPesquisar(event.target.value);
  };

  useEffect(() => {
    const filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(pesquisar.toLowerCase())
    );
    setPokemons(filteredPokemons);
  }, [pesquisar]);

  return (
    <>
      <Header pageName="Home" />
      <div className="HeaderPage mt-4 d-flex justify-content-center">
        <Form className="d-flex  w-75 mt-2">
          <FormControl
            type="text"
            name="pesquisarPokemon"
            placeholder="Pesquisar Pokemon"
            className="mr-sm-2 w-50"
            value={pesquisar}
            onChange={handleChange}
          />
          <p>Foram encontrados {allPokemons.length} pokemons</p>
        </Form>
      </div>
      <CardDeck className="cardDeckPersonalized">
        {loading === false ? (
          <div className="pokemon-cards d-flex flex-wrap">
            {pokemons.map((item) => (
              <Pokemon key={item.name} name={item.name} url={item.url} />
            ))}
          </div>
        ) : (
          <LoadingScreen />
        )}
      </CardDeck>
      <Pagination
        count={totalPages ? totalPages : 1}
        variant="outlined"
        color="secondary"
        size="small"
        shape="rounded"
        showFirstButton
        showLastButton
        onChange={handleChangePage}
      />
      <Footer />
    </>
  );
}
