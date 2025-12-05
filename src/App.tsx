import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Confirmacao } from './pages/Confirmacao';
import { Sucesso } from './pages/Sucesso';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/sucesso" element={<Sucesso />} />
      </Routes>
    </Router>
  );
}

export default App;