import React from 'react';
import { Clock, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const StatistiquesProfesseur = ({ creneauxParEtape }) => {
  const calculerStatistiquesGlobales = () => {
    const statistiques = {};

    Object.values(creneauxParEtape).forEach(creneauxEtape => {
      creneauxEtape.forEach(creneau => {
        const idProf = creneau.professeur.id;
        if (!statistiques[idProf]) {
          statistiques[idProf] = {
            professeur: creneau.professeur,
            heuresTotal: 0,
            heuresEnLigne: 0,
            heuresEnPresentiel: 0,
            creneauxParEtape: {}
          };
        }

        if (!statistiques[idProf].creneauxParEtape[creneau.etape.id]) {
          statistiques[idProf].creneauxParEtape[creneau.etape.id] = {
            etape: creneau.etape,
            creneaux: []
          };
        }
        statistiques[idProf].creneauxParEtape[creneau.etape.id].creneaux.push(creneau);

        statistiques[idProf].heuresTotal += 1;
        if (creneau.modeCours.id === 'online') {
          statistiques[idProf].heuresEnLigne += 1;
        } else {
          statistiques[idProf].heuresEnPresentiel += 1;
        }
      });
    });

    return Object.values(statistiques).sort((a, b) => b.heuresTotal - a.heuresTotal);
  };

  const statistiques = calculerStatistiquesGlobales();
  const totalProfesseurs = statistiques.length;
  const totalHeures = statistiques.reduce((sum, stat) => sum + stat.heuresTotal, 0);

  const gererExport = (statsProfesseur) => {
    const { professeur, creneauxParEtape } = statsProfesseur;
    
    const donnees = [
      ['Emploi du temps - ' + professeur.nom + ' (' + professeur.code + ')'],
      [''],
      ['Récapitulatif des heures'],
      ['Total', statsProfesseur.heuresTotal + 'h'],
      ['En ligne', statsProfesseur.heuresEnLigne + 'h'],
      ['Présentiel', statsProfesseur.heuresEnPresentiel + 'h'],
      [''],
      ['Détail par étape'],
      ['']
    ];

    Object.values(creneauxParEtape).forEach(({ etape, creneaux }) => {
      donnees.push([`Étape ${etape.nom}`]);
      donnees.push(['']);
      donnees.push(['Jour', 'Horaire', 'Cours', 'Mode', 'Durée']);

      const creneauxTries = [...creneaux].sort((a, b) => {
        const ordreJour = { 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5 };
        if (ordreJour[a.jour] !== ordreJour[b.jour]) {
          return ordreJour[a.jour] - ordreJour[b.jour];
        }
        return parseInt(a.heureDebut) - parseInt(b.heureDebut);
      });

      let jourActuel = null;
      let creneauxConsecutifs = [];

      creneauxTries.forEach((creneau, index) => {
        if (jourActuel !== creneau.jour) {
          if (creneauxConsecutifs.length > 0) {
            donnees.push(formaterCreneauxConsecutifs(creneauxConsecutifs));
            creneauxConsecutifs = [];
          }
          if (jourActuel !== null) {
            donnees.push(['']);
          }
          jourActuel = creneau.jour;
        }

        const creneauPrec = creneauxConsecutifs[creneauxConsecutifs.length - 1];
        if (creneauPrec && 
            creneauPrec.cours.code === creneau.cours.code && 
            creneauPrec.modeCours.id === creneau.modeCours.id &&
            parseInt(creneauPrec.heureFin) === parseInt(creneau.heureDebut)) {
          creneauxConsecutifs.push(creneau);
        } else {
          if (creneauxConsecutifs.length > 0) {
            donnees.push(formaterCreneauxConsecutifs(creneauxConsecutifs));
            creneauxConsecutifs = [];
          }
          creneauxConsecutifs = [creneau];
        }

        if (index === creneauxTries.length - 1 && creneauxConsecutifs.length > 0) {
          donnees.push(formaterCreneauxConsecutifs(creneauxConsecutifs));
        }
      });

      donnees.push(['']);
      donnees.push(['']);
    });

    const ws = XLSX.utils.aoa_to_sheet(donnees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emploi du temps");

    const styleEntete = { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } };
    
    [0, 2, 7].forEach(ligne => {
      const cellule = XLSX.utils.encode_cell({ r: ligne, c: 0 });
      if (ws[cellule]) ws[cellule].s = styleEntete;
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 8 }
    ];

    XLSX.writeFile(wb, `emploi_du_temps_${professeur.code}.xlsx`);
  };

  const formaterCreneauxConsecutifs = (creneaux) => {
    const premierCreneau = creneaux[0];
    const dernierCreneau = creneaux[creneaux.length - 1];
    return [
      premierCreneau.jour,
      `${premierCreneau.heureDebut} - ${dernierCreneau.heureFin}`,
      `${premierCreneau.cours.code} - ${premierCreneau.cours.nom}`,
      premierCreneau.modeCours.nom,
      `${creneaux.length}h`
    ];
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm p-4 mr-4 h-full overflow-hidden flex flex-col">
      <div className="flex-none mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistiques Globales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-emerald-600 text-2xl font-bold">{totalProfesseurs}</div>
            <div className="text-sm text-emerald-700">Professeurs actifs</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-600 text-2xl font-bold">{totalHeures}</div>
            <div className="text-sm text-blue-700">Heures totales</div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col">
          <h4 className="flex-none font-medium text-gray-700 bg-white py-2 sticky top-0 z-10">
            Détails par professeur
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {statistiques.map((stat) => (
              <div
                key={stat.professeur.id}
                className="bg-gray-50 rounded-lg p-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={stat.professeur.avatar}
                      alt={stat.professeur.nom}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{stat.professeur.nom}</div>
                      <div className="text-xs text-gray-500">{stat.professeur.code}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => gererExport(stat)}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Exporter l'emploi du temps"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-gray-600">En ligne</span>
                    <span className="font-medium text-blue-600">{stat.heuresEnLigne}h</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-gray-600">Présentiel</span>
                    <span className="font-medium text-emerald-600">{stat.heuresEnPresentiel}h</span>
                  </div>
                </div>
              </div>
            ))}
            
            {statistiques.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <div className="text-center py-6 text-gray-500">
                  Aucune réservation pour le moment
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesProfesseur;