import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarreLaterale from './composants/BarreLaterale';
import Calendrier from './composants/Calendrier/Calendrier';
import GestionCours from './composants/GestionCours';
import GestionProfesseurs from './composants/GestionProfesseurs';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <BarreLaterale />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<div>Tableau de bord</div>} />
            <Route path="/calendrier" element={<Calendrier />} />
            <Route path="/professeurs" element={<GestionProfesseurs />} />
            <Route path="/cours" element={<GestionCours />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;