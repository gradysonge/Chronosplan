import React, { useState } from 'react';
import { ChevronDown, Users, BookOpen, GraduationCap, Clock, Blend } from 'lucide-react';
import { professeurs, cours, etapes, modesEnseignement, durees } from '../../donnees/donneesMock';

const obtenirComposantIcone = (typeIcone, className = "w-4 h-4") => {
  switch (typeIcone) {
    case 'users':
      return <Users className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'graduation':
      return <GraduationCap className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'blend':
      return <Blend className={className} />;
    default:
      return null;
  }
};

const MenuDeroulant = ({ libelle, options, valeur, onChange, typeIcone }) => {
  const [estOuvert, setEstOuvert] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setEstOuvert(!estOuvert)}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-left flex justify-between items-center ${
          valeur ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {typeIcone && <span className="text-gray-500">{obtenirComposantIcone(typeIcone)}</span>}
          <span className={`${valeur ? 'text-emerald-700' : 'text-gray-700'}`}>
            {valeur || libelle}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 ${valeur ? 'text-emerald-400' : 'text-gray-400'}`} />
      </button>
      
      {estOuvert && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {Array.isArray(options) && options.map((option) => (
            <div
              key={option.id || option.code || option}
              className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onChange(option);
                setEstOuvert(false);
              }}
            >
              {option.typeIcone ? obtenirComposantIcone(option.typeIcone) : (option.icone ? option.icone : null)}
              <span>{option.code ? `${option.code} - ${option.nom}` : (typeof option === 'string' ? option : option.nom)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EnTeteCalendrier = ({ onChangementFiltre, filtres }) => {
  const [coursSelectionne, setCoursSelectionne] = useState(null);

  const gererChangementProfesseur = (prof) => {
    onChangementFiltre?.({ professeur: prof });
  };

  const gererChangementCours = (cours) => {
    setCoursSelectionne(cours);
    onChangementFiltre?.({ cours });
  };

  const gererChangementGroupe = (groupe) => {
    onChangementFiltre?.({ groupe });
  };

  const gererChangementModeCours = (mode) => {
    onChangementFiltre?.({ modeCours: mode });
  };

  const gererChangementEtape = (etape) => {
    onChangementFiltre?.({ etape });
  };

  const gererChangementDuree = (duree) => {
    onChangementFiltre?.({ duree });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-6 gap-4">
        <MenuDeroulant
          libelle="Code Professeur"
          options={professeurs}
          valeur={filtres?.professeur ? `${filtres.professeur.code} - ${filtres.professeur.nom}` : ''}
          onChange={gererChangementProfesseur}
          typeIcone="users"
        />
        <MenuDeroulant
          libelle="Code Cours"
          options={cours}
          valeur={filtres?.cours ? `${filtres.cours.code} - ${filtres.cours.nom}` : ''}
          onChange={gererChangementCours}
          typeIcone="book"
        />
        <MenuDeroulant
          libelle="Groupe"
          options={coursSelectionne?.groupes || []}
          valeur={filtres?.groupe || ''}
          onChange={gererChangementGroupe}
          typeIcone="users"
        />
        <MenuDeroulant
          libelle="Mode d'enseignement"
          options={modesEnseignement}
          valeur={filtres?.modeCours ? `${filtres.modeCours.icone} ${filtres.modeCours.nom}` : ''}
          onChange={gererChangementModeCours}
          typeIcone="blend"
        />
        <MenuDeroulant
          libelle="Étapes"
          options={etapes}
          valeur={filtres?.etape?.nom || ''}
          onChange={gererChangementEtape}
          typeIcone="graduation"
        />
        <MenuDeroulant
          libelle="Durée"
          options={durees}
          valeur={filtres?.duree?.nom || ''}
          onChange={gererChangementDuree}
          typeIcone="clock"
        />
      </div>
    </div>
  );
};

export default EnTeteCalendrier;