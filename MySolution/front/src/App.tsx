import React from 'react';
import Home from './components/Home';
import Funcionario from './components/Funcionario';
import Folha from './components/Folhas';
import { BrowserRouter, Routes, Link, Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
        <h1> My aplication WEBBBB </h1>
        <BrowserRouter>
          <ul>
            <li><Link to="/"> Pagina Inicial </Link></li>
            <li><Link to="/funcionario/cadastrar"> Cadastro de Funcionario </Link></li>
            <li><Link to="/folha/cadastrar"> Folha dos Funcionarios </Link></li>
          </ul>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/funcionario/cadastrar" element={<Funcionario />}/>
            <Route path="/folha/cadastrar" element={<Folha />}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
