import React from 'react';
import { Trash2, Clock, User2, BookOpen } from 'lucide-react';

const CreneauHoraire = ({
                          heureDebut,
                          heureFin,
                          professeur,
                          cours,
                          groupe,
                          modeCours,
                          consecutifs,
                          couleur,
                          onSupprimer,
                          onClick
                        }) => {
  return (
      <div
          className={`relative rounded-lg p-3 ${couleur.bg} transition-transform hover:scale-[1.02] group cursor-pointer flex flex-col justify-center space-y-2
`}
          style={{
            height: consecutifs > 1 ? `${consecutifs * 5}rem` : 'auto',
            maxHeight: '100%',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
      >
        {/* Heure */}
        <div className="flex items-center text-sm font-semibold text-gray-800 mb-1">
          <Clock className="w-4 h-4 mr-1 text-gray-500" />
          {heureDebut} - {heureFin}
          {consecutifs > 1 && (
              <span className={`ml-2 text-xs ${couleur.badge} text-white px-2 py-0.5 rounded`}>
            {consecutifs}h
          </span>
          )}
        </div>

        {/* Prof */}
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <User2 className="w-4 h-4 mr-1 text-gray-500" />
         
          {professeur.nom}
        </div>

        {/* Cours, groupe, mode */}
        <div className="flex items-center text-xs text-gray-600">
  <BookOpen className="w-4 h-4 mr-1 text-gray-500" />
  {cours?.code} • {modeCours?.icone || ''} {modeCours?.nom || 'Mode ?'} • {groupe}
</div>


        {/* Icône de suppression */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <button
              onClick={(e) => {
                e.stopPropagation();
                onSupprimer();
              }}
              title="Supprimer ce créneau"
              className="p-1 rounded-full hover:bg-white/70"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
  );
};

export default CreneauHoraire;
