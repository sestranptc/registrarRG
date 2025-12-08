import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Confirmacao } from './pages/Confirmacao';
import { Sucesso } from './pages/Sucesso';
import { Verificacao } from './pages/Verificacao';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/sucesso" element={<Sucesso />} />
        <Route path="/verificacao/:id" element={<Verificacao />} />
      </Routes>
    </Router>
  );
}

export default App;