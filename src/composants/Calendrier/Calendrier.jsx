import React, { useState, useContext } from 'react';
import EnTeteCalendrier from './EnTeteCalendrier';
import CreneauHoraire from './CreneauHoraire';
import SelecteurEtape from './SelecteurEtape';
import StatistiquesProfesseur from './StatistiquesProfesseur';
import { ContexteAuth } from '../../contexte/Authentification';
import { professeurs } from '../../donnees/donneesMock';
import { X, Clock, BookOpen, Users, Monitor, Blend, Trash2 } from 'lucide-react';
import { validerLimiteCoursProfesseur, respecteLimiteHeuresCoursProfesseurGroupe  } from '../../utils/Contraintes';


const joursDelaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const heures = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

const couleursProfesseurs = {
  P1: { bg: 'bg-blue-100 hover:bg-blue-200', badge: 'bg-blue-500' },
  P2: { bg: 'bg-green-100 hover:bg-green-200', badge: 'bg-green-500' },
  P3: { bg: 'bg-purple-100 hover:bg-purple-200', badge: 'bg-purple-500' },
  P4: { bg: 'bg-orange-100 hover:bg-orange-200', badge: 'bg-orange-500' },
  P5: { bg: 'bg-pink-100 hover:bg-pink-200', badge: 'bg-pink-500' },
  P6: { bg: 'bg-yellow-100 hover:bg-yellow-200', badge: 'bg-yellow-500' },
  P7: { bg: 'bg-indigo-100 hover:bg-indigo-200', badge: 'bg-indigo-500' },
  P8: { bg: 'bg-red-100 hover:bg-red-200', badge: 'bg-red-500' },
  P9: { bg: 'bg-teal-100 hover:bg-teal-200', badge: 'bg-teal-500' },
  P10: { bg: 'bg-cyan-100 hover:bg-cyan-200', badge: 'bg-cyan-500' },
  P11: { bg: 'bg-lime-100 hover:bg-lime-200', badge: 'bg-lime-500' },
  P12: { bg: 'bg-amber-100 hover:bg-amber-200', badge: 'bg-amber-500' },
  P13: { bg: 'bg-emerald-100 hover:bg-emerald-200', badge: 'bg-emerald-500' },
  P14: { bg: 'bg-fuchsia-100 hover:bg-fuchsia-200', badge: 'bg-fuchsia-500' },
  P15: { bg: 'bg-rose-100 hover:bg-rose-200', badge: 'bg-rose-500' },
  P16: { bg: 'bg-violet-100 hover:bg-violet-200', badge: 'bg-violet-500' },
  P17: { bg: 'bg-sky-100 hover:bg-sky-200', badge: 'bg-sky-500' },
  P18: { bg: 'bg-stone-100 hover:bg-stone-200', badge: 'bg-stone-500' },
  P19: { bg: 'bg-zinc-100 hover:bg-zinc-200', badge: 'bg-zinc-500' },
  P20: { bg: 'bg-gray-100 hover:bg-gray-200', badge: 'bg-gray-500' },
};

const Calendrier = () => {
  const { estAuthentifie } = useContext(ContexteAuth);
  const [creneauxParEtape, setCreneauxParEtape] = useState({});
  const [filtres, setFiltres] = useState({
    professeur: null,
    cours: null,
    groupe: null,
    modeCours: null,
    etape: null,
    duree: null
  });
  const [etapeVueSelectionnee, setEtapeVueSelectionnee] = useState(null);
  const [creneauSurvole, setCreneauSurvole] = useState(null);
  const [creneauSelectionne, setCreneauSelectionne] = useState(null);

  const regrouperCreneauxConsecutifs = (creneaux) => {
    const regroupes = [];
    let groupeCourant = null;

    creneaux.forEach((creneau) => {
      if (!groupeCourant ||
          groupeCourant.professeur.id !== creneau.professeur.id ||
          groupeCourant.jour !== creneau.jour ||
          parseInt(creneau.heureDebut) !== parseInt(groupeCourant.heureFin) ||
          groupeCourant.cours.code !== creneau.cours.code ||
          groupeCourant.groupe !== creneau.groupe ||
          groupeCourant.modeCours.id !== creneau.modeCours.id) {
        if (groupeCourant) {
          regroupes.push(groupeCourant);
        }
        groupeCourant = {
          ...creneau,
          consecutifs: 1,
          heureFinOriginale: creneau.heureFin
        };
      } else {
        groupeCourant.consecutifs++;
        groupeCourant.heureFin = creneau.heureFin;
      }
    });

    if (groupeCourant) {
      regroupes.push(groupeCourant);
    }

    return regroupes;
  };

  const gererChangementFiltre = (nouveauxFiltres) => {
    setFiltres({ ...filtres, ...nouveauxFiltres });
    if (nouveauxFiltres.etape) {
      setEtapeVueSelectionnee(nouveauxFiltres.etape);
    }
  };


  const estCreneauDisponible = (jour, heure, heuresConsecutives = 1) => {
    for (let i = 0; i < heuresConsecutives; i++) {
      // Vérification existante dans l'étape actuelle
      const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];

      const creneauxConflictuels = creneauxEtapeActuelle.filter(creneau =>
          creneau.jour === jour &&
          parseInt(creneau.heureDebut) === (heure + i) &&
          creneau.cours.code === filtres.cours?.code
      );

      if (creneauxConflictuels.length >= 2 ||
          creneauxConflictuels.some(creneau => creneau.modeCours.id === filtres.modeCours?.id)) {
        return false;
      }


      // Nouvelle vérification dans TOUTES les étapes (professeur occupé globalement)
      const professeurOccupeGlobalement = Object.values(creneauxParEtape).some(creneauxEtape =>
          creneauxEtape.some(creneau =>
              creneau.jour === jour &&
              parseInt(creneau.heureDebut) === (heure + i) &&
              creneau.professeur.id === filtres.professeur?.id
          )
      );

      if (professeurOccupeGlobalement) {

        return false; // Le professeur a déjà cours dans une autre étape au même moment
      }

      // Conserver la vérification de limite horaire
      if (heure + i >= 22) {
        return false;
      }
    }
    return true;
  };


  const tousLesFiltresSelectionnes = () => {
    return filtres.professeur && filtres.cours && filtres.groupe && filtres.modeCours && filtres.etape && filtres.duree;
  };

  const creerCreneauxConsecutifs = (jour, heureDebut, heuresConsecutives, professeur) => {
    const nouveauxCreneaux = [];
    for (let i = 0; i < heuresConsecutives; i++) {
      nouveauxCreneaux.push({
        id: `${jour}-${heureDebut + i}-${professeur.id}-${Date.now()}`,
        jour,
        heureDebut: `${heureDebut + i}:00`,
        heureFin: `${heureDebut + i + 1}:00`,
        professeur,
        cours: filtres.cours,
        groupe: filtres.groupe,
        modeCours: filtres.modeCours,
        etape: filtres.etape,
        couleur: couleursProfesseurs[professeur.id]
      });
    }
    return nouveauxCreneaux;
  };

  const reinitialiserFiltres = () => {
    setFiltres({
      professeur: null,
      cours: null,
      groupe: null,
      modeCours: null,
      etape: null,
      duree: null
    });
    setCreneauSurvole(null);
  };

  const gererClicCreneau = (jour, heure) => {
    if (!estAuthentifie) {
      alert('Vous devez être authentifié en tant qu\'administrateur pour créer un horaire.');
      return;
    }

    if (!tousLesFiltresSelectionnes()) {
      alert('Veuillez sélectionner tous les critères avant d\'attribuer une disponibilité');
      return;
    }

    if (!etapeVueSelectionnee) {
      alert('Veuillez sélectionner une étape pour l\'affichage');
      return;
    }

    const heuresConsecutives = filtres.duree?.id || 1;

    if (!estCreneauDisponible(jour, heure, heuresConsecutives)) {
      alert('Pas disponible');
      //alert('Cette plage horaire n\'est pas disponible pour le nombre d\'heures demandé');
      return;
    }

    // Vérifier la limite de 3 heures par semaine pour ce professeur, ce cours et ce groupe
    if (!validerLimiteCoursProfesseur(
      creneauxParEtape,
      etapeVueSelectionnee,
      filtres.professeur,
      filtres.cours,
      filtres.groupe,
      jour,
      heure,
      heuresConsecutives
    )) {
      alert('Un professeur ne peut pas donner le même cours plus de 3 heures par semaine au même groupe.');
      return;
    }

    if (!respecteLimiteHeuresCoursProfesseurGroupe(
        creneauxParEtape,
        filtres.professeur,
        filtres.cours,
        filtres.groupe,
        heuresConsecutives
    )) {
      alert('Un professeur ne peut pas donner le même cours plus de 3 heures par semaine au même groupe.');
      return;
    }


    const nouveauxCreneaux = creerCreneauxConsecutifs(jour, heure, heuresConsecutives, filtres.professeur);

    setCreneauxParEtape(prev => ({
      ...prev,
      [etapeVueSelectionnee.id]: [...(prev[etapeVueSelectionnee.id] || []), ...nouveauxCreneaux]
    }));

    reinitialiserFiltres();
  };

  const gererChangementEtape = (etape) => {
    setEtapeVueSelectionnee(etape);
    reinitialiserFiltres();
    setCreneauSelectionne(null);
  };

  const gererSuppressionCreneau = (creneauId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      setCreneauxParEtape(prev => {
        const creneauxMisAJour = { ...prev };
        Object.keys(creneauxMisAJour).forEach(etapeId => {
          creneauxMisAJour[etapeId] = creneauxMisAJour[etapeId].filter(creneau => creneau.id !== creneauId);
        });
        return creneauxMisAJour;
      });
      setCreneauSelectionne(null);
    }
  };

  const creneauxEtapeActuelle = etapeVueSelectionnee ? (creneauxParEtape[etapeVueSelectionnee.id] || []) : [];
  const creneauxHorairesGroupes = regrouperCreneauxConsecutifs(creneauxEtapeActuelle);

  const heuresVisibles = filtres.duree 
    ? heures.filter(heure => {
        const heuresConsecutives = filtres.duree.id;
        return heure + heuresConsecutives <= 22;
      })
    : heures;

  const estCreneauEnApercu = (jour, heure) => {
    if (!creneauSurvole || !filtres.duree) return false;
    const { jour: jourSurvole, heure: heureSurvole } = creneauSurvole;
    const nombreDuree = filtres.duree.id;
    
    return jour === jourSurvole && 
           heure >= heureSurvole && 
           heure < (heureSurvole + nombreDuree);
  };

  const obtenirCouleurFondCreneau = (jour, heure, estDisponible, peutSelectionner, estApercu) => {
    const creneauExistant = creneauxEtapeActuelle.find(
      creneau => creneau.jour === jour && parseInt(creneau.heureDebut) === heure
    );

    if (creneauExistant) {
      return creneauExistant.couleur.bg;
    }

    if (estApercu && filtres.professeur) {
      return couleursProfesseurs[filtres.professeur.id].bg;
    }

    if (!peutSelectionner) {
      return 'bg-gray-50';
    }

    return '';
  };

  const supprimerPlageReservation = (creneau) => {
    if (confirm('Supprimer toute la plage horaire de cette réservation ?')) {
      const heureDebut = parseInt(creneau.heureDebut);
      const heureFin = parseInt(creneau.heureFin);

      setCreneauxParEtape(prev => {
        const maj = { ...prev };
        maj[creneau.etape.id] = maj[creneau.etape.id].filter(c =>
            !(
                c.professeur.id === creneau.professeur.id &&
                c.jour === creneau.jour &&
                c.groupe === creneau.groupe &&
                c.cours.code === creneau.cours.code &&
                parseInt(c.heureDebut) >= heureDebut &&
                parseInt(c.heureDebut) < heureFin
            )
        );
        return maj;
      });

      setCreneauSelectionne(null);
    }
  };


  const rendreCreneauxHoraires = (jour, heure) => {
    const creneaux = creneauxHorairesGroupes.filter(
      creneau => creneau.jour === jour && parseInt(creneau.heureDebut) === heure
    );

    if (creneaux.length === 0) return null;

    if (creneaux.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 h-full">
          {creneaux.map((creneau) => (
            <CreneauHoraire
              key={creneau.id}
              heureDebut={creneau.heureDebut}
              heureFin={creneau.heureFin}
              professeur={creneau.professeur}
              cours={creneau.cours}
              groupe={creneau.groupe}
              modeCours={creneau.modeCours}
              consecutifs={creneau.consecutifs}
              couleur={creneau.couleur}
              onSupprimer={() => gererSuppressionCreneau(creneau.id)}
              onClick={() => setCreneauSelectionne(creneau)}
            />
          ))}
        </div>
      );
    }

    return creneaux.map((creneau) => (
      <CreneauHoraire
        key={creneau.id}
        heureDebut={creneau.heureDebut}
        heureFin={creneau.heureFin}
        professeur={creneau.professeur}
        cours={creneau.cours}
        groupe={creneau.groupe}
        modeCours={creneau.modeCours}
        consecutifs={creneau.consecutifs}
        couleur={creneau.couleur}
        onSupprimer={() => gererSuppressionCreneau(creneau.id)}
        onClick={() => setCreneauSelectionne(creneau)}
      />
    ));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-none p-6">
        <EnTeteCalendrier onChangementFiltre={gererChangementFiltre} filtres={filtres} />
        <SelecteurEtape
          etapeSelectionnee={etapeVueSelectionnee}
          onChangementEtape={gererChangementEtape}
        />
        
        {!etapeVueSelectionnee && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner une étape pour afficher ou modifier l'emploi du temps correspondant.
            </p>
          </div>
        )}
        
        {etapeVueSelectionnee && !tousLesFiltresSelectionnes() && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner tous les critères (Code Professeur, Code Cours, Groupe, Mode d'enseignement, Étapes, Durée) avant d'attribuer une disponibilité.
            </p>
          </div>
        )}

        {creneauSelectionne && (
            <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${creneauSelectionne.couleur.badge}`}/>
                  <h3 className="text-sm font-medium text-gray-700">Détails de la réservation</h3>
                </div>
                <button
                    onClick={() => setCreneauSelectionne(null)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500"/>
                </button>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400"/>
                    <div className="flex items-center">
                      <img
                          src={creneauSelectionne.professeur.avatar}
                          alt={creneauSelectionne.professeur.nom}
                          className="w-6 h-6 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{creneauSelectionne.professeur.nom}</p>
                        <p className="text-xs text-gray-500">{creneauSelectionne.professeur.code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{creneauSelectionne.cours.code}</p>
                      <p className="text-xs text-gray-500">{creneauSelectionne.cours.nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{creneauSelectionne.jour}</p>
                      <p className="text-xs text-gray-500">{creneauSelectionne.heureDebut} - {creneauSelectionne.heureFin}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800 flex items-center">
                        <span className="mr-1">{creneauSelectionne.modeCours.icone}</span>
                        {creneauSelectionne.modeCours.nom}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Groupe {creneauSelectionne.groupe}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bouton poubelle aligné à droite */}
                <button
                    onClick={() => supprimerPlageReservation(creneauSelectionne)}
                    className="p-2 rounded-full hover:bg-red-100 transition"
                    title="Supprimer cette réservation"
                >
                  <Trash2 className="w-5 h-5 text-red-500"/>
                </button>
              </div>


            </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="flex h-full">
          <StatistiquesProfesseur creneauxParEtape={creneauxParEtape}/>

          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="sticky top-0 z-10 bg-white grid grid-cols-5 border-b">
              {joursDelaSemaine.map((jour) => (
                  <div
                      key={jour}
                      className="px-4 py-3 text-center font-semibold text-gray-700 border-r last:border-r-0"
                  >
                    {jour}
                  </div>
              ))}
            </div>

            <div className="grid grid-cols-5">
              {joursDelaSemaine.map((jour) => (
                  <div key={jour} className="border-r last:border-r-0">
                    {heuresVisibles.map((heure) => {
                      const heuresConsecutives = filtres.duree?.id || 1;
                      const estDisponible = estCreneauDisponible(jour, heure, heuresConsecutives);
                      const peutSelectionner = etapeVueSelectionnee && tousLesFiltresSelectionnes() && estDisponible;
                      const estApercu = estCreneauEnApercu(jour, heure);
                      const couleurFond = obtenirCouleurFondCreneau(jour, heure, estDisponible, peutSelectionner, estApercu);

                      return (
                          <div
                              key={heure}
                              className={`h-24 border-b last:border-b-0 p-2 transition-colors duration-150 ${
                                  peutSelectionner ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                              } ${couleurFond} ${
                                  estApercu && filtres.professeur
                                      ? `border-2 border-${couleursProfesseurs[filtres.professeur.id].badge.replace('bg-', '')}`
                                      : ''
                              }`}
                              onClick={() => gererClicCreneau(jour, heure)}
                              onMouseEnter={() => peutSelectionner && setCreneauSurvole({jour, heure})}
                              onMouseLeave={() => setCreneauSurvole(null)}
                          >
                          <div className="text-xs text-gray-500 mb-1">
                          {`${heure}:00`}
                        </div>
                        {rendreCreneauxHoraires(jour, heure)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;