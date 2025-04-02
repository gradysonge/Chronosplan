import React, { useEffect, useState } from 'react';

const SelecteurEtape = ({ etapeSelectionnee, onChangementEtape, programmeId }) => {
  const [etapes, setEtapes] = useState([]);

  useEffect(() => {
    if (!programmeId) return;
  
    fetch(`http://localhost:5000/api/programmes/${programmeId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.etapes) {
          setEtapes(data.etapes);
        }
      })
      .catch(err => {
        console.error("Erreur lors du chargement des étapes :", err);
      });
  }, [programmeId]);
  

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Affichage par étape</h3>
        <div className="flex gap-2">
          {etapes.map((etapes) => (
            <button
              key={etapes.id}
              onClick={() => onChangementEtape(etapes)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                etapeSelectionnee?.id === etapes.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {etapes.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelecteurEtape;
