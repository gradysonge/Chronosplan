import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, BookOpen, GraduationCap, Clock, Blend } from 'lucide-react';
import { professeurs, modesEnseignement, durees } from '../../donnees/donneesMock';

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
              key={option._id || option.id || option.code || option}
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
  const [programmeSelectionne, setProgrammeSelectionne] = useState(null);
  const [etapesFiltrees, setEtapesFiltrees] = useState([]);
  const [programmesBD, setProgrammesBD] = useState([]);
  const [coursBD, setCoursBD] = useState([]);

  useEffect(() => {
    const fetchProgrammes = async () => {
      const res = await fetch('http://localhost:5000/api/programmes');
      const data = await res.json();
      setProgrammesBD(data);
    };

    const fetchCours = async () => {
      const res = await fetch('http://localhost:5000/api/cours');
      const data = await res.json();
      setCoursBD(data);
    };

    fetchProgrammes();
    fetchCours();
  }, []);

  const gererChangementProgramme = (programme) => {
    setProgrammeSelectionne(programme);
    setEtapesFiltrees(programme.etapes || []);
    onChangementFiltre?.({ programme });
  };

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

  const coursFiltresParEtape = filtres.etape
    ? coursBD.filter((c) => c.etapeId === filtres.etape.id)
    : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-7 gap-4">
        <MenuDeroulant
          libelle="Programme"
          options={programmesBD}
          valeur={programmeSelectionne?.nom || ''}
          onChange={gererChangementProgramme}
          typeIcone="graduation"
        />
        <MenuDeroulant
          libelle="Étapes"
          options={etapesFiltrees}
          valeur={filtres?.etape?.nom || ''}
          onChange={gererChangementEtape}
          typeIcone="graduation"
        />
        <MenuDeroulant
          libelle="Cours"
          options={coursFiltresParEtape}
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
          libelle="Professeur"
          options={professeurs}
          valeur={filtres?.professeur ? `${filtres.professeur.code} - ${filtres.professeur.nom}` : ''}
          onChange={gererChangementProfesseur}
          typeIcone="users"
        />
        <MenuDeroulant
          libelle="Mode de Livraison"
          options={modesEnseignement}
          valeur={filtres?.modeCours ? `${filtres.modeCours.icone} ${filtres.modeCours.nom}` : ''}
          onChange={gererChangementModeCours}
          typeIcone="blend"
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
