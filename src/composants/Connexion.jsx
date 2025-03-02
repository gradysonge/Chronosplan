import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexte/Authentification';
import '../styles/Connexion.css';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const { setEstAuthentifie } = useAuth();

  const handleConnexion = (e) => {
    e.preventDefault();

    // Compte administrateur par défaut
    const adminEmail = 'LaCite@chronosplan.com';
    const adminPassword = 'CollegeLacite870';

    if (email === adminEmail && password === adminPassword) {
      setEstAuthentifie(true); // Authentification réussie
      navigate('/'); // Rediriger vers la page d'accueil
    } else {
      setErreur('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left">
          <h1>ChronosPlan</h1>
          <h1>Bienvenue!!!</h1>
        </div>
        <div className="right">
          <div className="icon-container">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User Icon" className="login-icon" />
          </div>
          <h2>Connexion</h2>
          <p>Connectez-vous à votre compte pour continuer</p>
          <form onSubmit={handleConnexion}>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {erreur && <p className="error-message">{erreur}</p>}
            <a href="#">Mot de passe oublié ?</a>
            <button type="submit" className="btn">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Connexion;