import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Professors from './components/Professors';
import Calendar from './components/Calendar/Calendar';
import Accueil from './components/Accueil/Accueil';
=======
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
>>>>>>> main

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
<<<<<<< HEAD
            <Route path="/" element={<Accueil/>} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/professors" element={<Professors/>} />
=======
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/" element={<div>Tableau de bord</div>} />
            <Route path="/calendrier" element={<RouteProtegee><Calendrier /></RouteProtegee>} />
            <Route path="/professeurs" element={<RouteProtegee><GestionProfesseurs /></RouteProtegee>} />
            <Route path="/cours" element={<RouteProtegee><GestionCours /></RouteProtegee>} />
>>>>>>> main
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;