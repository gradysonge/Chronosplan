import React from 'react';
import { etapes } from '../../donnees/donneesMock';

const SelecteurEtape = ({ etapeSelectionnee, onChangementEtape }) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Affichage par étape</h3>
        <div className="flex gap-2">
          {etapes.map((etape) => (
            <button
              key={etape.id}
              onClick={() => onChangementEtape(etape)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                etapeSelectionnee?.id === etape.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {etape.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelecteurEtape;