import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexte/Authentification';
import BarreLaterale from './composants/BarreLaterale';
import Calendrier from './composants/Calendrier/Calendrier';
import GestionCours from './composants/GestionCours';
import GestionProfesseurs from './composants/GestionProfesseurs';
import Connexion from './composants/Connexion';

const RouteProtegee = ({ children }) => {
  const { estAuthentifie } = useAuth();
  return estAuthentifie ? children : <Navigate to="/connexion" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const masquerBarreLaterale = location.pathname === "/connexion";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {!masquerBarreLaterale && <BarreLaterale />}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>

            <Route path="/connexion" element={<Connexion />} />
            <Route path="/" element={<Acceuil/>} />
            <Route path="/calendrier" element={<RouteProtegee><Calendrier /></RouteProtegee>} />
            <Route path="/professeurs" element={<RouteProtegee><GestionProfesseurs /></RouteProtegee>} />
            <Route path="/cours" element={<RouteProtegee><GestionCours /></RouteProtegee>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;