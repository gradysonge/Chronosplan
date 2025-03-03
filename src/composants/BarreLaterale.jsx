import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Users, Home, ChevronDown, BookOpen } from 'lucide-react';
import clsx from 'clsx';

<<<<<<< HEAD:src/components/Sidebar.jsx
const user = {
  name: 'Samir Elouasbi',
  role: 'Administrateur la cité',
=======
const utilisateur = {
  nom: 'Samir Elouasbi',
  role: 'Administrateur',
>>>>>>> main:src/composants/BarreLaterale.jsx
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

const BarreLaterale = () => {
  return (
    <div className="flex flex-col h-screen bg-emerald-900 text-white w-64 p-4">
      <div className="flex items-center space-x-3 mb-8">
        {utilisateur.avatar && (
          <img src={utilisateur.avatar} alt={utilisateur.nom} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h2 className="font-semibold">{utilisateur.nom}</h2>
          <span className="text-sm text-emerald-200 flex items-center">
            {utilisateur.role}
            <ChevronDown className="w-4 h-4 ml-1" />
          </span>
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
          <span>Accueil</span>
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
    </div>
  );
};

export default BarreLaterale;