import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Calendar/Authentification';
import Sidebar from './components/Sidebar';
import Professors from './components/Professors';
import Calendar from './components/Calendar/Calendar';
import Connexion from './components/Calendar/Connexion';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/connexion" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/connexion";

  return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
        {!hideSidebar && <Sidebar />}
        <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>{children}</div>
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
              <Route path="/" element={<div>Dashboard à développer plus tard</div>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/professors" element={<ProtectedRoute><Professors /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
  );
}

export default App;
