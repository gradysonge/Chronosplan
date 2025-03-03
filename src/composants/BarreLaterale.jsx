import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Users, Home, ChevronDown, BookOpen, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexte/Authentification';
import clsx from 'clsx';

const utilisateur = {
  nom: 'Samir Elouasbi',
  role: 'Administrateur',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

const BarreLaterale = () => {
  const [menuUtilisateurOuvert, setMenuUtilisateurOuvert] = useState(false);
  const { setEstAuthentifie } = useAuth();
  const navigate = useNavigate();

  const deconnecter = () => {
    setEstAuthentifie(false);
    navigate('/connexion');
  };

  return (
    <div className="flex flex-col h-screen bg-emerald-900 text-white w-64 p-4">
      <div className="flex items-center space-x-3 mb-8">
        {utilisateur.avatar && (
          <img src={utilisateur.avatar} alt={utilisateur.nom} className="w-12 h-12 rounded-full" />
        )}
        <div className="relative">
          <h2 className="font-semibold">{utilisateur.nom}</h2>
          <button 
            className="text-sm text-emerald-200 flex items-center"
            onClick={() => setMenuUtilisateurOuvert(!menuUtilisateurOuvert)}
          >
            {utilisateur.role}
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${menuUtilisateurOuvert ? 'rotate-180' : ''}`} />
          </button>
          
          {menuUtilisateurOuvert && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button 
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={deconnecter}
              >
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                Se déconnecter
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                Paramètres
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <HelpCircle className="w-4 h-4 mr-2 text-gray-500" />
                Aide
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            clsx(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors',
              isActive ? 'bg-emerald-800' : 'hover:bg-emerald-800/50'
            )
          }
        >
          <Home className="w-5 h-5" />
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink
          to="/calendrier"
          className={({ isActive }) =>
            clsx(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors mt-2',
              isActive ? 'bg-emerald-800' : 'hover:bg-emerald-800/50'
            )
          }
        >
          <Calendar className="w-5 h-5" />
          <span>Horaire & Calendrier</span>
        </NavLink>

        <NavLink
          to="/professeurs"
          className={({ isActive }) =>
            clsx(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors mt-2',
              isActive ? 'bg-emerald-800' : 'hover:bg-emerald-800/50'
            )
          }
        >
          <Users className="w-5 h-5" />
          <span>Professeurs</span>
        </NavLink>

        <NavLink
          to="/cours"
          className={({ isActive }) =>
            clsx(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors mt-2',
              isActive ? 'bg-emerald-800' : 'hover:bg-emerald-800/50'
            )
          }
        >
          <BookOpen className="w-5 h-5" />
          <span>Cours & Programmes</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-emerald-800">
        <div className="bg-emerald-800/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">ChronosPlan v1.0</p>
          <p className="text-emerald-200 text-xs">© 2025 Collège La Cité</p>
        </div>
      </div>
    </div>
  );
};

export default BarreLaterale;